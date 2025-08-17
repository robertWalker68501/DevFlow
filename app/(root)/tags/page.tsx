import { getTags } from '@/lib/actions/tag.action';

const Tags = async () => {
  const { success, data, error } = await getTags({
    page: 1,
    pageSize: 10,
    query: 'test',
  });

  const tags = data || {};

  console.log('TAGS', JSON.stringify(tags, null, 2));

  return (
    <div>
      <h1 className='text-2xl'>Tags</h1>
    </div>
  );
};

export default Tags;
