import { SearchOutlined } from '@ant-design/icons';
import { Input } from 'antd';

interface SearchInputProps {
    searchQueryValue: string;
    handleSearchQueryValue: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchInput = ({ searchQueryValue , handleSearchQueryValue}: SearchInputProps) => {
  return (
    <Input 
      value={searchQueryValue}
      onChange={handleSearchQueryValue}
      title='Search'
      prefix={<SearchOutlined />}
      placeholder='Search over here!'
      style={{ height: '40px'}}
      className='bg-gray-50 border border-slate-200 px-4'
    />
  )
}

export default SearchInput