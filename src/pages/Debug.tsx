// @ts-nocheck
import React, { useState } from "react";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";

const contractAddress = "0x0f0B7aF98240387CF3eA33097A5F19509AE6D584";
const contractABI = [
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

const Debug = () => {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const [websiteName, setWebsiteName] = useState("");
  const [elements, setElements] = useState("");
  const [websiteCount, setWebsiteCount] = useState<bigint | null>(null);
  const [userWebsites, setUserWebsites] = useState<any[] | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState("");

  const fetchWebsiteCount = async () => {
    if (!address) return;
    const count = await publicClient.readContract({
      address: contractAddress,
      abi: contractABI,
      functionName: "getWebsiteCount",
      args: [address],
    });
    setWebsiteCount(count as bigint);
  };

  const fetchUserWebsites = async () => {
    if (!address) return;
    const websites = await publicClient.readContract({
      address: contractAddress,
      abi: contractABI,
      functionName: "getUserWebsites",
      args: [address],
    });
    setUserWebsites(websites as any[]);
  };

  const handleCreateWebsite = async () => {
    if (!walletClient) return;
    setIsCreating(true);
    setTransactionStatus("Creating website...");
    try {
      const parsedElements = JSON.parse(elements);
      const { request } = await publicClient.simulateContract({
        account: address,
        address: contractAddress,
        abi: contractABI,
        functionName: "createWebsite",
        args: [websiteName, parsedElements],
      });
      const hash = await walletClient.writeContract(request);
      await publicClient.waitForTransactionReceipt({ hash });
      setTransactionStatus("Website created successfully!");
      fetchWebsiteCount();
      fetchUserWebsites();
    } catch (error) {
      console.error("Error creating website:", error);
      setTransactionStatus(
        "Error creating website. Check console for details."
      );
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdateWebsite = async () => {
    if (!walletClient) return;
    setIsUpdating(true);
    setTransactionStatus("Updating website...");
    try {
      const parsedElements = JSON.parse(elements);
      const { request } = await publicClient.simulateContract({
        account: address,
        address: contractAddress,
        abi: contractABI,
        functionName: "updateWebsite",
        args: [websiteName, parsedElements],
      });
      const hash = await walletClient.writeContract(request);
      await publicClient.waitForTransactionReceipt({ hash });
      setTransactionStatus("Website updated successfully!");
      fetchUserWebsites();
    } catch (error) {
      console.error("Error updating website:", error);
      setTransactionStatus(
        "Error updating website. Check console for details."
      );
    } finally {
      setIsUpdating(false);
    }
  };

  React.useEffect(() => {
    fetchWebsiteCount();
    fetchUserWebsites();
  }, [address, publicClient]);

  return (
    <Card className="w-[350px] mx-auto">
      <CardHeader>
        <CardTitle>Website Builder Debug</CardTitle>
        <CardDescription>Interact with your smart contract</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid w-full items-center gap-4">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="websiteName">Website Name</Label>
            <Input
              id="websiteName"
              placeholder="Enter website name"
              value={websiteName}
              onChange={(e) => setWebsiteName(e.target.value)}
            />
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="elements">Elements (JSON format)</Label>
            <Textarea
              id="elements"
              placeholder='[["header", "Welcome"], ["paragraph", "This is my website"]]'
              value={elements}
              onChange={(e) => setElements(e.target.value)}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={handleCreateWebsite} disabled={isCreating}>
          {isCreating ? "Creating..." : "Create Website"}
        </Button>
        <Button onClick={handleUpdateWebsite} disabled={isUpdating}>
          {isUpdating ? "Updating..." : "Update Website"}
        </Button>
      </CardFooter>
      <CardContent>
        <p>Website Count: {websiteCount?.toString()}</p>
        <p>User Websites: {userWebsites?.length}</p>
        <p>{transactionStatus}</p>
      </CardContent>
    </Card>
  );
};

export default Debug;
