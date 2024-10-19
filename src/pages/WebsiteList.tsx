import React from "react";
import { Link } from "react-router-dom";
import { useReadContract } from "wagmi";
import { parseAbi } from "viem";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function truncateStr(str: string, n = 6) {
  if (!str) return "";
  return str.length > n
    ? str.substr(0, n - 1) + "..." + str.substr(str.length - n, str.length - 1)
    : str;
}

const contractAbi = [
  {
    name: "createWebsite",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "_name", type: "string" },
      { name: "_elements", type: "string[][]" },
    ],
    outputs: [],
  },
  {
    name: "updateWebsite",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "_name", type: "string" },
      { name: "_newElements", type: "string[][]" },
    ],
    outputs: [],
  },
  {
    name: "getWebsiteElements",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "_name", type: "string" }],
    outputs: [{ type: "string[][]" }],
  },
  {
    name: "getWebsiteCount",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "_user", type: "address" }],
    outputs: [{ type: "uint256" }],
  },
  {
    name: "getUserWebsites",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "_user", type: "address" }],
    outputs: [
      {
        type: "tuple[]",
        components: [
          { name: "name", type: "string" },
          { name: "elements", type: "string[][]" },
          { name: "owner", type: "address" },
        ],
      },
    ],
  },
  {
    name: "getWebsiteByName",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "_name", type: "string" }],
    outputs: [
      {
        type: "tuple",
        components: [
          { name: "name", type: "string" },
          { name: "elements", type: "string[][]" },
          { name: "owner", type: "address" },
        ],
      },
    ],
  },
  {
    name: "getAllWebsites",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [
      {
        type: "tuple[]",
        components: [
          { name: "name", type: "string" },
          { name: "elements", type: "string[][]" },
          { name: "owner", type: "address" },
        ],
      },
    ],
  },
];

// Address of the deployed smart contract
const contractAddress = "0x0f0B7aF98240387CF3eA33097A5F19509AE6D584"; // Replace with your contract address

const WebsiteList = () => {
  const {
    data: websites,
    isError,
    isLoading,
  } = useReadContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: "getAllWebsites",
  });

  console.log(websites);

  if (isLoading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load websites. Please check your connection and try again.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">All Websites</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {websites &&
          websites.map((site, i) => (
            <Card key={i}>
              <CardHeader>
                <CardTitle>{site.name}</CardTitle>
                <CardDescription>By {truncateStr(site.owner)}</CardDescription>
              </CardHeader>
              <CardContent>
                <Link
                  to={`/${site.name}`}
                  className="text-blue-500 hover:underline"
                >
                  View Website
                </Link>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  );
};

export default WebsiteList;
