import React from "react";
import styles from "../styles";
import { Button, FileInput, Select, TextInput } from "flowbite-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const CreatePost = () => {
  return (
    <div
      className={`${styles.padding} min-h-screen max-w-3xl mx-auto text-center font-poppins mb-12`}
    >
      <h1 className=" text-center font-semibold my-7 text-3xl">Create Post</h1>
      <form className=" flex flex-col gap-4">
        <div className=" flex flex-col sm:flex-row gap-4">
          <TextInput
            type="text"
            placeholder="Title"
            id="title"
            required
            className=" flex-1"
          />
          <Select>
            <option value="uncategorized">Select a category</option>
            <option value="javascript">JavaScript</option>
            <option value="reactjs">React.js</option>
            <option value="nextjs">Next.js</option>
          </Select>
        </div>
        <div className=" border-teal-500 border-dotted border-4 p-3 flex gap-4 items-center justify-between ">
          <FileInput type="file" accept="image/*" />
          <Button
            type="button"
            gradientDuoTone={"greenToBlue"}
            size="sm"
            outline
          >
            Upload Image
          </Button>
        </div>
        <ReactQuill
          theme="snow"
          placeholder="Write something.."
          className=" h-72 mb-12"
        />
        <Button type="submit" gradientDuoTone={"greenToBlue"} size="sm">
          Publish
        </Button>
      </form>
    </div>
  );
};

export default CreatePost;
