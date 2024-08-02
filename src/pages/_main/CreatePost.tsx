import PostForm from "@/components/forms/PostForm";

function CreatePost() {
  return (
    <div className="pb-[7.25rem] pt-10 lg:px-[3.75rem] lg:pt-20">
      <div className="flex items-center gap-2">
        <img
          src="/assets/icons/gallery-add.svg"
          alt=""
          className="invert-white w-9"
        />
        <h1 className="heading-lg">Create a Post</h1>
      </div>
      <PostForm />
    </div>
  );
}

export default CreatePost;
