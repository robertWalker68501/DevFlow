import { auth } from '@/auth';

const Home = async () => {
  const session = await auth();
  console.log(session);

  return (
    <div>
      <h1 className='text-2xl'>Home Page</h1>
    </div>
  );
};

export default Home;
