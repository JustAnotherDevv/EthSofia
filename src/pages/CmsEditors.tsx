// @ts-nocheck
import React, { ChangeEvent, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { solarizedlight } from "react-syntax-highlighter/dist/esm/styles/prism";
import { request } from "../utils/request";
// import FlatDirectory from "ethstorage-sdk/file";
// const copy = require("clipboard-copy");

// const sha3 = require("js-sha3").keccak_256;

import {
  sha3_512,
  sha3_384,
  sha3_256,
  sha3_224,
  keccak512,
  keccak384,
  keccak256,
  keccak224,
  shake128,
  shake256,
  cshake128,
  cshake256,
  kmac128,
  kmac256,
} from "js-sha3";
import FileUploader from "@/components/FileUploader";

// Mock custom component for demonstration
const CustomComponent = ({ type, props }) => {
  if (type === "ImageGallery") {
    return <div>Image Gallery Component (Props: {JSON.stringify(props)})</div>;
  }
  if (type === "ContactForm") {
    return <div>Contact Form Component (Props: {JSON.stringify(props)})</div>;
  }
  return <div>Unknown Component: {type}</div>;
};

const CMSEditor = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("");
  const [components, setComponents] = useState([]);
  const [customComponentType, setCustomComponentType] = useState("");
  const [customComponentProps, setCustomComponentProps] = useState("");
  const [file, setFile] = useState<File>();
  const [files, setFiles] = useState([]);
  const [reqs, setReqs] = useState({});
  const [currentReq, setCurrentReq] = useState(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      console.log(e.target.files[0].name);
      setFile(e.target.files[0]);
    }
  };

  const chunkLength = () => {
    return 24 * 1024;
  };

  //   const uploadFiles = (rawFiles) => {
  //     rawFiles = this.clearFile(rawFiles);
  //     const filesLen = rawFiles.length + this.files.length;
  //     if (this.limit && this.limit < filesLen) {
  //       return this.onExceed(rawFiles, this.files);
  //     }
  //     this.startUpload(rawFiles);
  //   };

  //   const clearFile = (rawFiles) => {
  //     const newFiles = [];
  //     for (const rawFile of rawFiles) {
  //       const uid = keccak256(rawFile.name + rawFile.size + rawFile.type);
  //       let isExits = false;
  //       for (const file of this.files) {
  //         if (file.uid === uid) {
  //           isExits = true;
  //           break;
  //         }
  //       }
  //       if (!isExits) {
  //         newFiles.push(rawFile);
  //       }
  //     }
  //     return newFiles;
  //   };

  //   // init
  //   const startUpload = (rawFiles) => {
  //     for (const rawFile of rawFiles) {
  //       const file = this.normalizeFiles(rawFile);
  //       this.normalizeReq(file);
  //     }
  //     // auto start upload
  //     this.autoUpload();
  //   };

  //   const normalizeFiles = (rawFile) => {
  //     let chunkSize = 1;
  //     if (rawFile.size > this.chunkLength) {
  //       chunkSize = Math.ceil(rawFile.size / this.chunkLength);
  //     }
  //     const file = {
  //       name: rawFile.name,
  //       size: rawFile.size,
  //       type: rawFile.type,
  //       totalChunks: chunkSize,
  //       percent: 0,
  //       uid: keccak256(rawFile.name + rawFile.size + rawFile.type),
  //       status: "init", // value list: init pending success failure
  //       raw: rawFile,
  //     };
  //     // concat does not change the existing arrays, but instead returns a new array
  //     this.files.push(file);
  //     return file;
  //   };

  //   const normalizeReq = (file) => {
  //     const { uid } = file;
  //     this.reqs[uid] = {
  //       chunkLength: this.chunkLength,
  //       account: this.account,
  //       contractAddress: this.fileContract,
  //       flatDirectoryAddress: this.flatDirectory,
  //       dirPath: this.dirPath,
  //       file: file,
  //       onSuccess: this.handleSuccess.bind(this, file),
  //       onError: this.handleError.bind(this, file),
  //       onProgress: this.handleProgress.bind(this, file),
  //     };
  //   };

  //   const getFirstReq = () => {
  //     const keys = Object.keys(this.reqs);
  //     if (keys && keys.length > 0) {
  //       return this.reqs[keys[0]];
  //     }
  //     return null;
  //   };

  // const autoUpload = async () => {
  // //   if (this.currentReq) {
  // //     // is upload
  // //     return;
  // //   }
  // //   if (!this.beforeUpload || this.beforeUpload()) {
  //     this.currentReq = this.getFirstReq();
  //     while (this.currentReq) {
  //       const options = this.currentReq;
  //       const file = this.currentReq.file;
  //       file.status = "pending";
  //       this.onChange(file, this.files);
  //       await this.customRequestClint(options);

  //       // next
  //       this.currentReq = this.getFirstReq();
  //     }
  // //   }
  // };

  const handleSave = () => {
    console.log("Saving:", { title, content, author, category, components });
  };

  const handlePublish = () => {
    console.log("Publishing:", {
      title,
      content,
      author,
      category,
      components,
    });
  };

  const addComponent = (type) => {
    setComponents([...components, { type, props: {} }]);
  };

  const addCustomComponent = () => {
    if (customComponentType) {
      setComponents([
        ...components,
        {
          type: customComponentType,
          props: customComponentProps ? JSON.parse(customComponentProps) : {},
        },
      ]);
      setCustomComponentType("");
      setCustomComponentProps("");
    }
  };

  const uploadEthStorage = async () => {
    const request = {
      key: "test.txt",
      content: file,
      type: 2,
      callback: callback,
    };
    // await FlatDirectory.upload(request);
  };

  return (
    <div className="container mx-auto p-4">
      <FileUploader />
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="picture">Picture</Label>
        <Input id="picture" type="file" onChange={handleFileChange} />
      </div>
      <Button />
      <Tabs defaultValue="editor" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="editor">Editor</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="components">Components</TabsTrigger>
        </TabsList>
        <TabsContent value="editor">
          <Card>
            <CardHeader>
              <CardTitle>Content Editor</CardTitle>
              <CardDescription>
                Create or edit your content here using Markdown.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="content">Content (Markdown)</Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={10}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="author">Author</Label>
                <Input
                  id="author"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="category">Category</Label>
                <Select onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="lifestyle">Lifestyle</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="health">Health</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handleSave}>
                Save Draft
              </Button>
              <Button onClick={handlePublish}>Publish</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="preview">
          <Card>
            <CardHeader>
              <CardTitle>{title || "Untitled"}</CardTitle>
              <CardDescription>
                By {author || "Unknown"} | Category:{" "}
                {category || "Uncategorized"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ReactMarkdown
                children={content}
                components={{
                  code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || "");
                    return !inline && match ? (
                      <SyntaxHighlighter
                        children={String(children).replace(/\n$/, "")}
                        style={solarizedlight}
                        language={match[1]}
                        PreTag="div"
                        {...props}
                      />
                    ) : (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  },
                }}
              />
              {components.map((component, index) => (
                <CustomComponent key={index} {...component} />
              ))}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="components">
          <Card>
            <CardHeader>
              <CardTitle>Add Components</CardTitle>
              <CardDescription>
                Select components to add to your page.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Button onClick={() => addComponent("ImageGallery")}>
                  Add Image Gallery
                </Button>
                <Button onClick={() => addComponent("ContactForm")}>
                  Add Contact Form
                </Button>
              </div>
              <div className="space-y-2">
                <Label htmlFor="customComponentType">
                  Custom Component Type
                </Label>
                <Input
                  id="customComponentType"
                  value={customComponentType}
                  onChange={(e) => setCustomComponentType(e.target.value)}
                  placeholder="e.g., VideoPlayer"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customComponentProps">
                  Custom Component Props (JSON)
                </Label>
                <Textarea
                  id="customComponentProps"
                  value={customComponentProps}
                  onChange={(e) => setCustomComponentProps(e.target.value)}
                  placeholder='e.g., {"src": "https://example.com/video.mp4"}'
                />
              </div>
              <Button onClick={addCustomComponent}>Add Custom Component</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CMSEditor;
