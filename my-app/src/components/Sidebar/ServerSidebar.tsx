"use client";
import {
  SidebarChannel,
  SidebarHeader,
  SidebarSearch,
  SidebarSection,
  SidebarMember,
} from "@/components/Sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useAuth, useServerByServerId } from "@/hooks";
import { Channel, ChannelType, Member, MemberRole, Role } from "@/models";
import { Hash, Mic, ShieldAlert, ShieldCheck, VideoIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const iconMap = {
  [ChannelType.TEXT]: <Hash className="mr-2 h-4 w-4" />,
  [ChannelType.AUDIO]: <Mic className="mr-2 h-4 w-4" />,
  [ChannelType.VIDEO]: <VideoIcon className="mr-2 h-4 w-4" />,
};

const roleIconMap = {
  [Role.GUEST]: null,
  [Role.MODERATOR]: <ShieldCheck className="mr-2 h-4 w-4 text-indigo-500" />,
  [Role.ADMIN]: <ShieldAlert className="mr-2 h-4 w-4 text-rose-500" />,
};

export const ServerSidebar = ({ serverId }: { serverId: string }) => {
  const { profile, isLoading: profileLoading } = useAuth();
  const router = useRouter();
  const {
    server,
    isLoading: serverLoading,
    mutate: mutateServerByServerId,
  } = useServerByServerId(serverId);

  useEffect(() => {
    if (profileLoading || serverLoading) return;
    if (!profile) router.replace("/");
  }, [profile, router, server, profileLoading, serverLoading]);
  

  if (profileLoading || serverLoading) return null;
  if (!profile || !server) return null;

  const textChannels =
    server?.channels.filter((channel: Channel) => channel.type === ChannelType.TEXT);
  const audioChannels =
    (server?.channels ??
    []).filter((channel: Channel) => channel.type === ChannelType.AUDIO);
  const videoChannels =
    (server?.channels ??
    []).filter((channel: Channel) => channel.type === ChannelType.VIDEO);
  const members =
    server?.members.filter((member: Member) => member.profile_id !== profile?.id);

  const role = server.members?.find(
    (member: Member) => member.profile_id === profile.id
  )?.role;
  

  return (
    <div className="text-primary flex h-full w-full flex-col bg-[#dbdde2] dark:bg-[#2B2D31] text-xl">
      {server && (
        <SidebarHeader
          server={server}
          mutateServerByServerId={mutateServerByServerId}
          role={role as MemberRole}
        />
      )}
      <ScrollArea className="flex-1 px-3 ">
        <div className="mt-2 text-xl">
          <SidebarSearch
            data={[
              {
                label: "Text Channels",
                type: "channel",
                data: textChannels.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type] ?? (
                    <Hash className="mr-2 h-4 w-4" />
                  ),
                })),
              },
              {
                label: "Voice Channels",
                type: "member",
                data: audioChannels.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                })),
              },
              {
                label: "Video Channels",
                type: "channel",
                data: videoChannels.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                })),
              },
              {
                label: "Members",
                type: "member",
                data: members.map((member) => ({
                  id: member.id,
                  name: member.profile.name,
                  icon: roleIconMap[member.role],
                })),
              },
            ]}
          />
        </div>
        <Separator className="my-2 rounded-md bg-zinc-200 dark:bg-zinc-700" />
        {!!textChannels?.length && (
          <div className="mb-2">
            <SidebarSection
              sectionType="channels"
              channelType={ChannelType.TEXT}
              role={role}
              label="Text Channels"
            />
            <div className="space-y-[2px]">
              {textChannels.map((channel) => (
                <SidebarChannel
                  key={channel.id}
                  channel={channel}
                  role={role}
                  server={server}
                />
              ))}
            </div>
          </div>
        )}
        {!!audioChannels?.length && (
          <div className="mb-2">
            <SidebarSection
              sectionType="channels"
              channelType={ChannelType.AUDIO}
              role={role}
              label="Voice Channels"
            />
            <div className="space-y-[2px]">
              {audioChannels.map((channel) => (
                <SidebarChannel
                  key={channel.id}
                  channel={channel}
                  role={role}
                  server={server}
                />
              ))}
            </div>
          </div>
        )}
        {!!textChannels?.length && (
          <div className="mb-2">
            <SidebarSection
              sectionType="channels"
              channelType={ChannelType.VIDEO}
              role={role}
              label="Video Channels"
            />
            <div className="space-y-[2px]">
              {videoChannels.map((channel) => (
                <SidebarChannel
                  key={channel.id}
                  channel={channel}
                  role={role}
                  server={server}
                />
              ))}
            </div>
          </div>
        )}
        {!!server.members?.length && (
          <div className="mb-2">
            <SidebarSection
              sectionType="members"
              role={role}
              label="Members"
              server={server}
            />
            <div className="space-y-[2px]">
              {server.members.map((member) => (
                <SidebarMember key={member.id} member={member} />
              ))}
              
            </div>
            
          </div>
        )}
      </ScrollArea>
    </div>
  );
};
