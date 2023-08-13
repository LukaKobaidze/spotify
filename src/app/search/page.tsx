import Header from '@/components/Header';
import Searchbar from '@/components/Searchbar';

interface Props {}

export default function SearchPage(props: Props) {
  return (
    <>
      <Header>
        <Searchbar />
      </Header>
    </>
  );
}
