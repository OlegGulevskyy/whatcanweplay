import { useParams } from "next/navigation";

export const useAppParams = () => {
  const params = useParams<{ lang: string }>();

  return params;
};
