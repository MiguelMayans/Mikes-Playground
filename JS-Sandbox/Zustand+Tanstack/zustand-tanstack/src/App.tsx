import { Repo } from "./hooks/types";
import { useFetchRepos } from "./hooks/useRepos";
import Card from "./components/Card";
import { useLikedReposStore } from "./store/likedRepos";

const App = () => {
  const { data, isLoading } = useFetchRepos();
  const { likedReposIds } = useLikedReposStore();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {data?.map((repo: Repo) => (
        <Card
          key={repo.id}
          repo={repo}
          isLiked={likedReposIds.includes(repo.id)}
        />
      ))}
    </div>
  );
};

export default App;
