import { type Database } from "~/server/supabase/supabaseTypes";

type GameDetailsViewProps = Database["public"]["Tables"]["games"]["Row"];

const lines = (text: string) => text.split("\n");

export const GameDetailsView = (props: GameDetailsViewProps) => {
  return (
    <div className="p-4">
      <div>
        <h3 className="mb-4 mt-4 text-xl font-semibold leading-7 text-gray-900">
          {props.title}
        </h3>
        <p className="text-md mt-1 max-w-2xl leading-6 text-gray-500">
          {props.purpose}
        </p>
      </div>
      <div className="mt-6 border-t border-gray-100">
        <dl className="divide-y divide-gray-100">
          <div className="py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            {props.setup && (
              <div className="py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="mb-4 text-lg font-medium leading-6 text-gray-900">
                  🌈 Setup
                </dt>
                <dd className="text-md mt-1 leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  <ul className="flex flex-col gap-4 px-6 list-disc">
                    {props.setup.map((line, i) => (
                      <li key={i}>{line}</li>
                    ))}
                  </ul>
                </dd>
              </div>
            )}

            {props.rules && (
              <div className="py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="mb-4 text-lg font-medium leading-6 text-gray-900">
                  📏 Rules
                </dt>
                <dd className="text-md mt-1 leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  <ol className="flex list-decimal flex-col gap-4 px-6">
                    {props.rules.map((line, i) => (
                      <li key={i}>{line}</li>
                    ))}
                  </ol>
                </dd>
              </div>
            )}
          </div>

          <div className="py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            {props.how_to_play && (
              <div className="py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="mb-4 text-lg font-medium leading-6 text-gray-900">
                  🎳 How to play?
                </dt>
                <dd className="text-md mt-1 leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  <ul className="flex flex-col gap-4 px-2">
                    {lines(props.how_to_play).map((line, i) => (
                      <li key={i}>{line}</li>
                    ))}
                  </ul>
                </dd>
              </div>
            )}
          </div>
          <div className="py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            {props.how_to_win && (
              <div className="py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="mb-4 text-lg font-medium leading-6 text-gray-900">
                  🎯 How to win?
                </dt>
                <dd className="text-md mt-1 leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  <ul className="flex flex-col gap-4">
                    {lines(props.how_to_win).map((line, i) => (
                      <li key={i}>{line}</li>
                    ))}
                  </ul>
                </dd>
              </div>
            )}
          </div>

          <div className="py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            {props.additional_info && (
              <div className="py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="mb-4 text-lg font-medium leading-6 text-gray-900">
                  💁 Additional information
                </dt>
                <dd className="text-md mt-1 leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  <ul className="flex flex-col gap-4">
                    {lines(props.additional_info).map((line, i) => (
                      <li key={i}>{line}</li>
                    ))}
                  </ul>
                </dd>
              </div>
            )}
          </div>
        </dl>
      </div>
    </div>
  );
};
