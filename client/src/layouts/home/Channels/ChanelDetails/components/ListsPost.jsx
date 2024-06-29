import React, { useEffect, useMemo, useState } from 'react';
import { useGetPostsInChannelQuery } from '../../../../../services/redux/query/usersQuery';
import SinglePost from '../../../../../components/ui/SinglePost';
import useObserver from '../../../../../hooks/useObserver';
function ListsPost({ channelId }) {
  const [changeData, setChangeData] = useState(false);
  const [posts, setPosts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [curPage, setCurPage] = useState(1);
  const { data: postsData, isSuccess: isSuccessPostsData } =
    useGetPostsInChannelQuery({
      channelId: channelId,
      search: `page=${curPage}`,
    });
  const { itemRef } = useObserver(
    hasMore,
    curPage,
    setCurPage,
    isSuccessPostsData,
    postsData?.posts,
    postsData?.totalPage
  );
  const handleChangeData = (isChange) => {
    setChangeData(isChange);
  };
  const renderedPosts = useMemo(() => {
    return posts?.map((p) => {
      return <SinglePost changeData={handleChangeData} key={p._id} post={p} />;
    });
  }, [posts]);
  useEffect(() => {
    if (changeData) {
      setPosts([]);
      setHasMore(true);
      setChangeData(false);
      setCurPage(1);
    }
  }, [changeData]);
  useEffect(() => {
    if (isSuccessPostsData && postsData) {
      setPosts((prevPosts) => {
        if (curPage === 1) {
          return [...postsData.posts];
        }
        return [...prevPosts, ...postsData.posts];
      });
      if (postsData?.totalPage === curPage) {
        setHasMore(false);
      }
    }
  }, [isSuccessPostsData, postsData, curPage]);
  return (
    <div className='flex flex-col gap-8 mt-8 text-neutral-700 dark:text-neutral-300'>
      {renderedPosts}
      {hasMore && (
        <p className='text-center' ref={itemRef}>
          Loading more...
        </p>
      )}
    </div>
  );
}

export default ListsPost;
