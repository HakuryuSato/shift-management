'use client'
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
// const supabase = createClient(`https://<project>.supabase.co", "<your-anon-key>`);

function App() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getUsers();
  }, []);

  async function getUsers() {
    const { data } = await supabase.from("users").select();
    console.log(data);
    setUsers(data);
  }

  function isNone(users){
    if(users == null || users.length === 0){
      return true;
    }
    return false;
  }

  return (
    <div>
      <h1>Users:</h1>
      <ul>
        {users.map(user => (
          <li key={user.id}>{user.user_name}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
