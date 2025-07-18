"use client";

import { axiosInstance } from "@/api/axiosIntance";
import { Server } from "@/models";
import useSWR from "swr";
import { SWRConfiguration } from "swr/_internal";

export const useServers = (options?: Partial<SWRConfiguration<Server[]>>) => {
  const {
    data: servers,
    error,
    isLoading,
    mutate,
  } = useSWR<Server[]>(`/api/servers`, {
    ...options,
  });

  const createServer = async ({
    name,
    image,
  }: {
    name: string;
    image: File | "";
  }) => {
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("image", image || "");

      await axiosInstance.post("/api/servers", formData);

      await mutate();
    } catch (error) {
      console.log(error);
    }
  };

  const joinServer = async ({
    inviteCode,
    profileId,
  }: {
    inviteCode: string;
    profileId: string;
  }): Promise<Server | undefined> => {
    try {
      const response = await axiosInstance.post(
        `/api/servers/${inviteCode}/member`,
        {
          profileId,
        },
      );

      await mutate();

      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  const editServer = async ({
    serverId,
    name,
    image,
  }: {
    serverId: string;
    name: string;
    image: File;
  }) => {
    try {
      console.log({ name, image });
      const formData = new FormData();
      formData.append("name", name);
      if (image) formData.append("image", image);

      await axiosInstance.patch(`/api/servers/${serverId}`, formData);

      await mutate();
    } catch (error) {
      console.log(error);
    }
  };

  return {
    servers,
    error,
    isLoading,
    createServer,
    joinServer,
    editServer,
  };
};