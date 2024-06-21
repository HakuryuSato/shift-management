import { supabase } from '@utils/supabase/supabase';

export const getServerSideProps = async () => {
    let { data: user, error } = await supabase
        .from('user')
        .select('user_name');

    return {
        props: {
            user,
            error,
        },
    };
};

// const UserComponent = ({ user, error }) => {
//   if (error) return <div>Error: {error.message}</div>;
//   return (
//     <div>
//       {user.map((u, index) => (
//         <div key={index}>{u.user_name}</div>
//       ))}
//     </div>
//   );
// };

// export default UserComponent;
