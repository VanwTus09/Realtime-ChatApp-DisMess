"use client";

import { cn } from "@/lib/utils";
import { Channel, ChannelType, MemberRole, Role, Server } from "@/models";
import { Edit, Hash, Lock, Mic, Trash, Video } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { ActionTooltip } from "@/components/action-tooltip";
import { ModalType, useModal } from "@/hooks";

interface ServerChannelProps {
  channel: Channel;
  server: Server;
  role?: MemberRole | string;
}

const iconMap = {
  [ChannelType.TEXT]: Hash,
  [ChannelType.AUDIO]: Mic,
  [ChannelType.VIDEO]: Video,
};

export const SidebarChannel = ({
  channel,
  server,
  role,
}: ServerChannelProps) => {
  const params = useParams<{ serverId: string; channelId: string }>();
  const router = useRouter();
  const { onOpen } = useModal();

  const Icon = iconMap[channel.type];

  const handleClick = () => {
    router.push(`/servers/${params.serverId}/channels/${channel.id}`);
  };

  const handleAction = (e: React.MouseEvent, action: ModalType) => {
    e.stopPropagation();
    onOpen(action, { server, channel });
  };
  return (
    <button
      onClick={handleClick}
      className={cn(
        "group mb-1 flex w-full cursor-pointer items-center gap-x-2 rounded-md px-2 py-2 transition hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50",
        params?.channelId === channel.id && "bg-zinc-700/20 dark:bg-zinc-700",
      )}
    >
      <Icon className="h-5 w-5 flex-shrink-0 text-zinc-500 dark:text-zinc-400" />
      <p
        className={cn(
          "group:hover:text-zinc-600 line-clamp-1 text-sm font-semibold text-zinc-500 transition dark:text-zinc-400 dark:group-hover:text-zinc-300",
          params?.channelId === channel.id &&
            "text-primary dark:text-zinc-200 dark:group-hover:text-white",
        )}
      >
        {channel.name}
      </p>
      {channel.name !== "general" && role !== Role.GUEST && (
        <div className="ml-auto flex items-center gap-x-2">
          <ActionTooltip label="Edit">
            <Edit
              onClick={(e) => handleAction(e, "editChannel")}
              className="hidden h-4 w-4 text-zinc-500 transition group-hover:block hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300"
            />
          </ActionTooltip>
          <ActionTooltip label="Delete">
            <Trash
              onClick={(e) => handleAction(e, "deleteChannel")}
              className="hidden h-4 w-4 text-zinc-500 transition group-hover:block hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300"
            />
          </ActionTooltip>
        </div>
      )}
      {channel.name === "general" && (
        <ActionTooltip label="This channel cannot be edited or deleted">
          <Lock className="ml-auto h-4 w-4 text-zinc-500 transition group-hover:block hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300" />
        </ActionTooltip>
        // <Lock className="ml-auto h-4 w-4 text-zinc-500 dark:text-zinc-400" />
      )}
    </button>
  );
};