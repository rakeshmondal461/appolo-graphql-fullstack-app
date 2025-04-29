import { useState } from "react";
import "./App.css";
import { gql, useQuery } from "@apollo/client";
const query = gql`
  query GetAllTodods {
    getTodos(limit: 10) {
      id
      title
      user {
        id
        name
        email
      }
    }
  }
`;

type TodoType = {
  id: number;
  title: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
};

function App() {
  const { data, error, loading } = useQuery(query);

  if (error)
    return (
      <>
        <h4>Something went wrong</h4>
      </>
    );
  if (loading)
    return (
      <>
        <h4>Loading, please wait...</h4>
      </>
    );
  console.log("data", data);
  return (
    <>
      <div>
        <table border={1}>
          <thead>
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>User</th>
            </tr>
          </thead>
          <tbody>
            {data.getTodos?.map((item: TodoType, index: number) => {
              return (
                <tr key={index}>
                  <td>{item.id}</td>
                  <td>{item.title}</td>
                  <td>
                    <ul>
                      <li>User id: {item.user.id}</li>
                      <li>Name: {item.user.name}</li>
                      <li>Email: {item.user.email}</li>
                    </ul>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default App;
