"use client";

import { Fragment, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";
import { format } from "date-fns";
import Link from "next/link";

import { cn } from "~/utils/cn";
import { PageLayout } from "../page-layout";
import { PLAY_ROUTE_PATH, getGameRoutePath } from "~/constants/navigation";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { LoadingScreen } from "../Loading";
import { toast } from "../ui/use-toast";

const locations = {
  home: "text-green-700 bg-green-50 ring-green-600/20",
  bar: "text-red-600 bg-red-50 ring-red-500/10",
  car: "text-yellow-800 bg-yellow-50 ring-yellow-600/20",
  office: "text-blue-700 bg-blue-50 ring-blue-600/20",
};

const EmptyGamesHistory = () => {
  return (
    <div className="flex h-[400px] flex-col items-center justify-center gap-8 p-4">
      <p className="text-center text-lg text-gray-500">
        You have no games yet.
      </p>
      <Link href={PLAY_ROUTE_PATH} className="w-full">
        <Button className="w-full text-lg">🚀 Generate a game</Button>
      </Link>
    </div>
  );
};

export const HistoryView = () => {
  const { mutateAsync: deleteGame, isLoading: isGameDeleting } =
    api.game.deleteById.useMutation();

  const handleDeleteGame = (id: string) => {
    deleteGame({ id }).then(() => {
      toast({
        title: "Game deleted",
        description: "Game has been deleted successfully",
      });
    });
  };

  const [offset, setOffset] = useState<[number, number]>([0, 15]);
  const [filterByLocation, setFilterByLocation] = useState<
    keyof typeof locations | undefined
  >(undefined);

  const { data: gamesData, isLoading: isGamesLoading } =
    api.game.getGamesByUser.useQuery({
      from: offset[0],
      to: offset[1],
      filterByLocation: filterByLocation,
    });

  if (isGameDeleting || isGamesLoading) {
    return <LoadingScreen />;
  }

  if (!gamesData) {
    return <EmptyGamesHistory />;
  }

  const handleLoadMore = () => {
    const loadMoreBy = 5;
    setOffset([offset[0], offset[1] + loadMoreBy]);
  };

  const handleFilterBy = (location: keyof typeof locations | undefined) => {
    setFilterByLocation(location);
  };

  return (
    <PageLayout>
      <PageLayout.Header />
      <PageLayout.Body>
        {gamesData.games.length === 0 ? (
          <EmptyGamesHistory />
        ) : (
          <div className="p-4">
            <h1 className="text-md mb-4 font-semibold text-slate-600">
              You have {gamesData.totalCount} games in total
            </h1>
            {filterByLocation && (
              <div className="mb-4 flex flex-col">
                <div className="flex flex-row">
                  <p className="text-sm text-gray-500">Filtering by:&nbsp;</p>
                  <p
                    className={cn(
                      locations[filterByLocation],
                      "whitespace-nowrap rounded-md px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset",
                    )}
                  >
                    {filterByLocation}
                  </p>
                </div>
                <Button
                  onClick={() => setFilterByLocation(undefined)}
                  className="mt-2"
                >
                  Clear filter
                </Button>
              </div>
            )}
            <ul role="list" className="divide-y divide-gray-100">
              {gamesData.games.map((game) => (
                <li
                  key={game.id}
                  className="flex items-center justify-between gap-x-6 py-5"
                >
                  <Link
                    href={getGameRoutePath(game.id)}
                    className="w-full min-w-0"
                  >
                    <div>
                      <div className="flex items-start gap-x-3">
                        <p className="text-lg font-semibold leading-6 text-gray-900">
                          {game.title}
                        </p>
                        {game.location && (
                          <p
                            className={cn(
                              locations[
                                game.location as keyof typeof locations
                              ],
                              "mt-0.5 whitespace-nowrap rounded-md px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset",
                            )}
                          >
                            {game.location}
                          </p>
                        )}
                      </div>
                      <div className="mt-1 flex items-center gap-x-2 text-xs leading-5 text-gray-500">
                        <p className="whitespace-nowrap">
                          Created on{" "}
                          <time dateTime={game.created_at ?? ""}>
                            {format(game.created_at ?? "", "MMM dd, yyyy")}
                          </time>
                        </p>
                      </div>
                    </div>
                  </Link>
                  <div className="flex flex-none items-center gap-x-4">
                    <Link
                      href={getGameRoutePath(game.id)}
                      className="hidden rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:block"
                    >
                      🚀 Play
                      <span className="sr-only">, {game.title}</span>
                    </Link>
                    <Menu as="div" className="relative flex-none">
                      <Menu.Button className="-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900">
                        <span className="sr-only">Open options</span>
                        <EllipsisVerticalIcon
                          className="h-5 w-5"
                          aria-hidden="true"
                        />
                      </Menu.Button>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="absolute right-0 z-10 mt-2 w-[200px] origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                          <Menu.Item>
                            {({ active }) => (
                              <Link
                                href={getGameRoutePath(game.id)}
                                className={cn(
                                  active ? "bg-gray-50" : "",
                                  "block px-3 py-1 text-sm leading-6 text-gray-900",
                                )}
                              >
                                Open
                                <span className="sr-only">, {game.title}</span>
                              </Link>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                className={cn(
                                  "block px-3 py-1 text-sm leading-6 text-gray-900",
                                )}
                                onClick={() =>
                                  handleFilterBy(
                                    game.location as keyof typeof locations,
                                  )
                                }
                              >
                                Filter by {game.location} games
                                <span className="sr-only">, {game.title}</span>
                              </button>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <div className="mt-4 w-full px-2">
                                <button
                                  className={cn(
                                    "block w-full rounded-md py-1 text-sm leading-6 text-gray-900",
                                    "bg-red-50 hover:bg-red-100",
                                  )}
                                  onClick={() => handleDeleteGame(game.id)}
                                >
                                  Delete
                                  <span className="sr-only">
                                    , {game.title}
                                  </span>
                                </button>
                              </div>
                            )}
                          </Menu.Item>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  </div>
                </li>
              ))}
            </ul>

            {(gamesData.totalCount ?? 0) > gamesData.games.length && (
              <Button onClick={handleLoadMore} className="w-full text-lg">
                Load more
              </Button>
            )}
          </div>
        )}
      </PageLayout.Body>
    </PageLayout>
  );
};
