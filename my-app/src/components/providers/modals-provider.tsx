"use client";

import {
  CreateServerModal,
  DeleteChannelModal,
  DeleteMessageModal,
  InviteModal,
  MembersModal,
  MessageFileModal,
} from "@/components/modals";
import { useEffect, useState } from "react";

export const ModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      {children}
      <CreateServerModal />
      <MembersModal />
      <DeleteChannelModal />
      <InviteModal/>
      <MessageFileModal />
      <DeleteMessageModal />
    </>
  );
};
