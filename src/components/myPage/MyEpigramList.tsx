'use client';

import { getNewEpigramDatas } from '@/api/client/getNewEpigramDatas';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import Card from '../common/Card';
import { LoadingSpinner } from '../common/LoadingSpinner';

const MyEpigramList = () => {
  const { data, fetchNextPage, hasNextPage, isLoading } = useInfiniteQuery({
    queryKey: ['epigrams'],
    queryFn: ({ pageParam = 0 }) => getNewEpigramDatas(pageParam, 5), // pageParam는 fetchNextPage를 호출하면 nextCursor 값이 전달된다.
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor || undefined,
  });

  // data.pages에 있는 배열들이 각각의 list배열을 가지고 있는데 이것들을 하나로 합쳐서 배열로 반환함
  const epigrams = data?.pages.flatMap((page) => page.list) ?? [];

  const queryClient = useQueryClient();
  const [isEpigramVisible, setIsEpigramVisible] = useState(true); // 에피그램 리스트의 가시성 상태

  useEffect(() => {
    return () => {
      queryClient.removeQueries({ queryKey: ['epigrams'] });
    };
  }, [queryClient]);

  if (isLoading) return <LoadingSpinner />;

  const handleToggleVisibility = () => {
    setIsEpigramVisible((prevState) => !prevState);
  };

  return (
    <div className="flex flex-col gap-10">
      <h1
        className="cursor-pointer text-left text-xl font-semibold xl:text-[24px] xl:leading-8"
        onClick={handleToggleVisibility}
      >
        내 에피그램 ({epigrams.length})
      </h1>
      {isEpigramVisible && ( // 에피그램 리스트의 가시성 상태에 따라 보여주기
        <div>
          <div className="flex flex-col gap-4">
            {epigrams && epigrams.length > 0 ? (
              epigrams.map((epigram) => (
                <div key={epigram.id}>
                  <Card responseData={epigram} />
                </div>
              ))
            ) : (
              <div>데이터가 없어요</div>
            )}
          </div>
          <div className="mt-[72px] text-center">
            <button
              onClick={() => fetchNextPage()}
              disabled={!hasNextPage}
              className={`rounded-full border border-[#CFDBEA] px-[20px] py-3 text-lg font-medium text-[#8B9DBC] xl:px-[50px] xl:text-2xl ${
                hasNextPage
                  ? 'hover:bg-[#919191] hover:text-black-950'
                  : 'border-[#CFDBEA]'
              }`}
            >
              {hasNextPage ? '+ 에피그램 더보기' : '데이터가 없어요'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyEpigramList;
