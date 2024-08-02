import { useQuery } from "@tanstack/react-query";
import api from "../api/github";
import { Repo } from "./types";

const fetchRepos = async () => {
  const { data } = await api.get<Repo[]>("/users/MiguelMayans/repos");
  return data;
};

export const useFetchRepos = () => {
  return useQuery({ queryKey: ["repos"], queryFn: fetchRepos });
};
