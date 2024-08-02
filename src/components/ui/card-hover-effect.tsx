import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Button } from "./button";

export const HoverEffect = ({
  items,
  className,
}: {
  items: any;
  className?: string;
}) => {
  let [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div
      className={cn(
        "grid grid-cols-1 py-10  lg:max-h-[1024px] 2xl:grid-cols-2",
        className,
      )}
    >
      {items?.map((item, idx) => (
        <Link
          to={item?.link}
          key={item?.link}
          className="group relative  block h-full w-full p-2"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence>
            {hoveredIndex === idx && (
              <motion.span
                className="absolute inset-0 block h-full w-full rounded-3xl bg-slate-800/[0.8]"
                layoutId="hoverBackground"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { duration: 0.15 },
                }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.15, delay: 0.2 },
                }}
              />
            )}
          </AnimatePresence>
          <Card item={item}>
            <div className="grid h-[142px] grid-rows-[auto_1fr_auto] place-items-center">
              <div>
                <Link to={`/profile/${item.id}`}>
                  <img
                    src={item.photoUrl}
                    alt="avatar"
                    className={`h-[54px] w-[54px] rounded-full object-cover `}
                  />
                </Link>
              </div>
              <div className="row-start-2 row-end-3 mt-[0.6125rem] self-start text-center leading-none">
                <h3
                  className={`text-sm font-semibold leading-[1.4] text-white `}
                >
                  {item.fullName}
                </h3>
                {item.username && (
                  <small
                    className={` text-xs font-medium leading-[1.4] text-light-300 `}
                  >
                    @ {item.username}
                  </small>
                )}
              </div>
              <Button className="mt-3 block bg-primary" size="sm">
                Follow
              </Button>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export const Card = ({
  className,
  children,
  item,
}: {
  className?: string;
  children: React.ReactNode;
  item: any;
}) => {
  return (
    <div>
      <div
        className={cn(
          "border-dark-500 relative z-20 grid h-[190px] w-[190px]  place-items-center overflow-hidden rounded-2xl border bg-dark-100 group-hover:border-slate-700 dark:border-white/[0.2]",
          className,
        )}
      >
        <div className="relative z-50">
          <div className="">{children}</div>
        </div>
      </div>
    </div>
  );
};
export const CardTitle = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <h4 className={cn("mt-4 font-bold tracking-wide text-zinc-100", className)}>
      {children}
    </h4>
  );
};
export const CardDescription = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <p
      className={cn(
        "mt-8 text-sm leading-relaxed tracking-wide text-zinc-400",
        className,
      )}
    >
      {children}
    </p>
  );
};
