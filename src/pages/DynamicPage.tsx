// @ts-nocheck
import React from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { solarizedlight } from "react-syntax-highlighter/dist/esm/styles/prism";

const pagesData = {
  "tech-blog": {
    title: "Tech Blog",
    content:
      '# Welcome to my Tech Blog\n\nThis is a blog about the latest in technology.\n\n```javascript\nconst greeting = "Hello, World!";\nconsole.log(greeting);\n```',
    author: "John Doe",
  },
  "cooking-recipes": {
    title: "Cooking Recipes",
    content:
      "# Delicious Recipes\n\nHere you'll find my favorite recipes.\n\n## Pasta Carbonara\n\nIngredients:\n- Spaghetti\n- Eggs\n- Pancetta\n- Parmesan cheese",
    author: "Jane Smith",
  },
  "travel-diaries": {
    title: "Travel Diaries",
    content:
      "# My Travel Adventures\n\nJoin me as I explore the world!\n\n![Travel](https://via.placeholder.com/600x400.png?text=Beautiful+Landscape)",
    author: "Alice Johnson",
  },
};

const DynamicPage = () => {
  const { slug } = useParams();
  const pageData = pagesData[slug];

  if (!pageData) {
    return <div>Page not found</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>{pageData.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <ReactMarkdown
            children={pageData.content}
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
          <p className="mt-4 text-sm text-gray-500">
            Author: {pageData.author}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DynamicPage;
