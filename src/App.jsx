import React, { useState, useEffect } from 'react';

function App() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    // FETCH PARA OBTENER LOS USUARIOS DE FIREBASE
    const fetchUsers = async () => {
      const response = await fetch('https://rep-kod-abril-24-default-rtdb.firebaseio.com/users.json');
      const data = await response.json();
      if (data) {
        const usersList = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        setUsers(usersList);
      }
    };

    fetchUsers();

    // COMPROBAR SI HAY USERS EN LOCALSTORAGE
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      const user = users.find(user => user.id === storedUserId);
      if (user) {
        setCurrentUser(user);
      }
    }
  }, [users]);

  const handleLogin = async () => {
    const newUser = { name, email };

    // GUARDAR EL USER EN FIREBASE
    const response = await fetch('https://rep-kod-abril-24-default-rtdb.firebaseio.com/users.json', {
      method: 'POST',
      body: JSON.stringify(newUser),
    });

    const data = await response.json();
    const loggedInUser = { id: data.name, ...newUser };

    // GUARDAR EL USER ID EN LOCALSTORAGE
    localStorage.setItem('userId', loggedInUser.id);

    setCurrentUser(loggedInUser);
  };

  const handleLogout = () => {
    // ELIMINAR EL USER ID DE LOCALSTORAGE
    localStorage.removeItem('userId');
    setCurrentUser(null);
    setFriends([]);
  };

  const addFriend = (user) => {
    setFriends([...friends, user]);
  };

  return (
    <>
    <div className="container px-5 mt-5">
      {!currentUser ? (
        <div className="row align-items-start gap-5">
          {/* FORMULARIO LOG IN */}
          <div className="col-md-6 col-lg-5 bg-light border p-4 rounded">
            <h2>Log In</h2>
            <div className="mb-3">
              <label className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button className="btn btn-primary" onClick={handleLogin}>
              Save
            </button>
          </div>

          {/* CAJA CON TEXTO */}
          <div className="col-md-6 col-lg-5 bg-light border p-4 rounded">
            <div>
              <h1>Ejercicio ReactJS</h1>
              <h3>Log In, Log Out, Peticiones a Firebase.</h3><br/>
              <p>
                Primera vista: Log In que utiliza como Token la key generada en la database de Firebase para guardarse en el Local Storage. 
                <br/><br/>
                Segunda vista: Usuario logueado, se muestra Lista de Users que ha sido guardada en database de Firebase con anterioridad. Botón para crear Friends List. Botón superior para realizar Log Out.
                <br/><br/>
                Tercera vista: Te devuelve a la pantalla original donde realizas Log In. 
                <br/><br/>
                React Hooks utilizados: useState y useEffect.
                <br />
                Fetch Async: para las solicitudes realizadas a la database de Firebase.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <h2>Welcome, {currentUser.name}</h2>
          <button className="btn btn-danger mb-3" onClick={handleLogout}>
            Log Out
          </button>
          <h3>Users List</h3>
          <ul className="list-group">
            {users.map((user) => (
              <li key={user.id} className="list-group-item d-flex justify-content-between align-items-center">
                {user.name} ({user.email})
                <button className="btn btn-success" onClick={() => addFriend(user)}>
                  Add to Friends
                </button>
              </li>
            ))}
          </ul>
          <h3 className="mt-3">Friends List</h3>
          <ul className="list-group d-inline-block mb-5">
            {friends.map((friend) => (
              <li key={friend.id} className="list-group-item">
                {friend.name} ({friend.email})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
    </>
  );
}

export default App
