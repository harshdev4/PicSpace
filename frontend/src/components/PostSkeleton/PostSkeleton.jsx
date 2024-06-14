import Skeleton, { SkeletonTheme }  from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import './PostSkeleton.css';
const PostSkeleton = () => {
  return (
    <div className="skeletonContainer">
        <div className="image">
            <Skeleton containerClassName="skeleton" height={"27vw"}/>
        </div>
        <div className="image">
            <Skeleton containerClassName="skeleton" height={"27vw"}/>
        </div>
        <div className="image">
            <Skeleton containerClassName="skeleton" height={"27vw"}/>
        </div>
    </div>
  );
};

export default PostSkeleton;
