/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { useMemo } from 'react';
import { Button, Box } from '@chakra-ui/react';
import { useInfiniteQuery } from 'react-query';

import { Header } from '../components/Header';
import { CardList } from '../components/CardList';
import { api } from '../services/api';
import { Loading } from '../components/Loading';
import { Error } from '../components/Error';

type Image = {
  title: string;
  description: string;
  url: string;
  ts: number;
  id: string;
};

type FetchImagesParams = {
  pageParam?: number | null;
};

export default function Home(): JSX.Element {
  const fetchImages = async ({ pageParam = 0 }: FetchImagesParams) => {
    const response = await api.get(`/images?after=${pageParam}`);

    return response.data;
  };

  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery('images', fetchImages, {
    getNextPageParam: lastPage => lastPage.after ?? null,
  });

  const formattedData = useMemo(
    () => (data ? data.pages.map(page => page.data).flat() : []),
    [data]
  );

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <Error />;
  }

  return (
    <>
      <Header />

      <Box maxW={1120} px={20} mx="auto" my={20}>
        <CardList cards={formattedData} />
        {hasNextPage && (
          <Button
            mt="10"
            isFullWidth
            maxW="134px"
            h="40px"
            bg="orange.500"
            onClick={() => fetchNextPage()}
            isLoading={isFetchingNextPage}
          >
            Carregar mais
          </Button>
        )}
      </Box>
    </>
  );
}
