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

// Updated ABI to match the new smart contract
const contractAbi = parseAbi([
  "function getWebsites() view returns (tuple(uint256 id, string title, string author, string slug)[])",
]);

// Address of the deployed smart contract
const contractAddress = "0x..."; // Replace with your contract address

const WebsiteList = () => {
  const {
    data: websites,
    isError,
    isLoading,
  } = useReadContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: "getWebsites",
  });

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
          websites.map((site) => (
            <Card key={site.id.toString()}>
              <CardHeader>
                <CardTitle>{site.title}</CardTitle>
                <CardDescription>By {site.author}</CardDescription>
              </CardHeader>
              <CardContent>
                <Link
                  to={`/${site.slug}`}
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
