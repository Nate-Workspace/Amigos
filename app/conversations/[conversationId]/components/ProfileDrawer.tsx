"use client";

import useOtherUser from "@/app/hooks/useOtherUser";
import { Conversation, User } from "@prisma/client";
import { format } from "date-fns";
import { Fragment, useMemo, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { IoClose, IoTrash } from "react-icons/io5";
import Avatar from "@/app/components/Avatar";
import ConfirmModal from "./ConfirmModal";
import AvatarGroup from "@/app/components/AvatarGroup";
import useActiveList from "@/app/hooks/useActiveList";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  data: Conversation & {
    users: User[];
  };
}

const ProfileDrawer = ({ data, isOpen, onClose }: Props) => {
  const otherUser = useOtherUser(data);
  const [confirmOpen, setConfirmOpen]= useState(false)

  //Updating the Active status with Pusher
  const {members}= useActiveList()
  const isActive = members.indexOf(otherUser?.email!) !== -1;

  const joinedDate = useMemo(() => {
    return format(new Date(otherUser.createdAt), "PP");
  }, [otherUser.createdAt]);

  const title = useMemo(() => {
    return data.name || otherUser.name;
  }, [data.name, otherUser.name]);

  const statusText = useMemo(() => {
    if (data.isGroup) {
      return `${data.users.length} members`;
    }

    return isActive ? "Active": "Offline";
  }, [data, isActive]);

  return (
    <>
    <ConfirmModal  isOpen={confirmOpen} onClose={()=>{setConfirmOpen(false)}}/>
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* BACKDROP */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-40" />
        </Transition.Child>

        {/* PANEL CONTAINER */}
        <div className="fixed inset-0 flex items-end justify-end">
          <div className="absolute inset-0 overflow-hidden">
            <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
              {/* PANEL TRANSITION */}
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="w-screen max-w-md bg-white shadow-xl">
                  <div className="h-full flex flex-col overflow-y-scroll py-6">
                    {/* CLOSE BUTTON */}
                    <div className="px-4 sm:px-6 flex items-start justify-end">
                      <button
                        onClick={onClose}
                        type="button"
                        className="
                        rounded-md bg-white text-gray-400 hover:text-gray-500 
                        focus:outline-none focus:ring-2 focus:ring-sky-500 
                        focus:ring-offset-2"
                      >
                        <span className="sr-only">Close Panel</span>
                        <IoClose size={24} />
                      </button>
                    </div>

                    {/* CONTENT */}
                    <div className="mt-6 flex-1 px-4 sm:px-6">
                      <div className="flex flex-col items-center">
                        <div className="mb-2">
                          {data.isGroup? (
                            <AvatarGroup users={data.users}/>
                          ): (
                            <Avatar user={otherUser} />
                          )}
                        </div>
                        <div>{title}</div>
                        <div className="text-sm text-gray-500">
                          {statusText}
                        </div>
                        <div className="flex gap-10 my-8">
                          <div
                            onClick={() => setConfirmOpen(true)}
                            className="flex 
                            flex-col gap-2 items-center cursor-pointer 
                            hover:opacity-75"
                          >
                            <div
                              className="w-10 h-10 bg-neutral-100 rounded-full
                            flex items-center justify-center"
                            >
                              <IoTrash size={20} />
                            </div>
                            <div className="text-sm font-light text-neutral-600">
                              delete
                            </div>
                          </div>
                        </div>
                        <div
                          className="
                        w-full pb-5 pt-5 sm:px-0 sm:pt-0"
                        >
                          <dl
                            className="space-y-8 px-4
                          sm:space-y-6 sm:px-6"
                          >
                            {data.isGroup && (
                              <div>
                                <dt className="
                                text-sm font-medium text-gray-500
                                sm:w-40 sm:flex-shrink-0">
                                  Emails
                                </dt>
                                <dd className="mt-1
                                text-sm text-gray-900 sm:col-span-2">
                                  {data.users.map((user)=> user.email).join(',  ')}
                                </dd>
                              </div>
                            )}
                            {!data.isGroup && (
                              <div>
                                <dt
                                  className="
                                text-sm font-medium 
                                text-gray-500 sm:w-40 
                                sm:flex-shrink-0"
                                >
                                  Email
                                </dt>
                                <dd
                                  className="mt-1 text-sm 
                                text-gray-900 sm:col-span-2"
                                >
                                  {otherUser.email}
                                </dd>
                              </div>
                            )}
                            {!data.isGroup && (
                              <>
                                <hr />
                                <div>
                                  <dt
                                    className="
                                text-sm font-medium text-gray-500
                                sm:w-40 sm:flex-shrink-0
                                "
                                  >
                                    Joined
                                  </dt>
                                  <dd className="
                                  mt-1 text-sm text-gray-900
                                  sm:col-span-2">
                                    <time dateTime={joinedDate}>
                                      {joinedDate}
                                    </time>
                                  </dd>
                                </div>
                              </>
                            )}
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition>
    </>
  );
};

export default ProfileDrawer;
