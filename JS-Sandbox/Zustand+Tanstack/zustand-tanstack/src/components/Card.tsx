import { Repo } from "../hooks/types";
import { useLikedReposStore } from "../store/likedRepos";

type CardProps = {
  repo: Repo;
  isLiked: boolean;
};

const Card = ({ repo, isLiked }: CardProps) => {
  const addLikedRepo = useLikedReposStore((state) => state.addLikedRepo);
  const removeLikedRepo = useLikedReposStore((state) => state.removeLikedRepo);

  const handleClick = () => {
    if (isLiked) {
      removeLikedRepo(repo.id);
    } else {
      addLikedRepo(repo.id);
    }
  };

  return (
    <>
      <h2>{repo.name}</h2>
      <button className="button" onClick={handleClick}>
        {isLiked ? "Dislike" : "Like"}
      </button>
    </>
  );
};

export default Card;
