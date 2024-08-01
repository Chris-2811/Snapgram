import { sidebarLinks } from "@/constants";
import AuthContext from "@/context/AuthContext";
import useUserId from "@/hooks/useUserId";
import { auth } from "@/lib/firebase/firebase";
import { useGetUserById } from "@/lib/react-query/queriesAndMutations";
import { signOut } from "firebase/auth";
import { useContext } from "react";
import { useLocation } from "react-router-dom";
import { NavLink } from "react-router-dom";

type NavbarSideProps = {
  uid: string;
};

function NavbarSide() {
  const { pathname } = useLocation();
  const { user } = useContext(AuthContext);
  const { data: userData } = useGetUserById(user?.uid);

  async function handleLogout() {
    try {
      await signOut(auth);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="sticky top-0 hidden max-h-[1024px] px-6 pb-8 pt-12 lg:block lg:min-w-[270px]">
      <img
        src={
          userData?.photoUrl ? userData?.photoUrl : "/assets/images/logo.svg"
        }
        alt="company logo"
        className="w-[174px]"
      />
      <NavLink
        to={`/profile/${user?.uid}`}
        className="my-11 flex items-center gap-3"
      >
        <img
          src="/assets/images/profile.png"
          alt="profile picture"
          className="w-[54px]"
        />
        <div>
          <p className="text-[1.125rem] font-bold tracking-[-1px] text-light-200">
            {userData?.name}
          </p>
          <small className="text-sm text-light-300">
            {userData?.username && `@'${userData?.username}`}
          </small>
        </div>
      </NavLink>
      <nav aria-label="primary-navigation">
        <ul role="list" className="flex flex-col gap-6">
          {sidebarLinks.map((link, index) => {
            const isActive = pathname === link.route;

            return (
              <li
                key={index}
                className={`${
                  isActive && "bg-primary"
                } relative rounded-lg p-4`}
              >
                <NavLink to={link.route}>
                  <div className="flex items-center gap-4">
                    <img
                      src={link.imgURL}
                      alt=""
                      className={`${isActive && "invert-white"}`}
                    />
                    <p>{link.label}</p>
                  </div>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="mt-[8.75rem] px-4">
        <div
          onClick={handleLogout}
          className="flex cursor-pointer items-center gap-4"
        >
          <img src="/assets/icons/logout.svg" alt="" />
          <p>Logout</p>
        </div>
        <div className="mt-8 flex cursor-pointer items-center gap-4">
          <img src="/assets/icons/settings.svg" alt="" className="w-6" />
          <p>Settings</p>
        </div>
      </div>
    </div>
  );
}

export default NavbarSide;
