import { useEffect, useState } from 'react';
import Cookies from 'universal-cookie';
import BackButton from '../../01-Reusable/Buttons/BackButton';
import AdminBanner from '../../01-Reusable/HeroBanner/AdminBanner';
import AlertPopup from '../../01-Reusable/PopUp/AlertPopup';
import InfoPopup from '../../01-Reusable/PopUp/InfoPopup';
import Table3 from '../../01-Reusable/Table/Table3';
import './AdminSettings.css';

const AdminSettings = () => {
  const [users, setUsers] = useState([]);
  const [emails, setEmails] = useState([]);
  const [email, setEmail] = useState({});
  const [visible, setVisible] = useState(false);
  const [errors, setErrors] = useState({});
  const [userMode, setUserMode] = useState(true);
  const [deleted, setDeleted] = useState(false);
  const [editing, setEditing] = useState(false);
  const [edited, setEdited] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [id, setId] = useState(0);
  let _changedUsers = [];

  const handleDeleting = (id) => {
    setDeleting(true);
    setId(id);
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/user/all');
      const data = await response.json();
      if (response.ok) {
        setUsers(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchEmails = async () => {
    try {
      const response = await fetch('/api/admin_email/all');
      const data = await response.json();
      if (response.ok) {
        setEmails(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleVisibility = () => {
    setVisible(!visible);
  };

  const handleUserMode = () => {
    setUserMode(true);
  };

  const handleEmailMode = () => {
    setUserMode(false);
  };

  const cookies = new Cookies();

  const deleteUser = async () => {
    const response = await fetch('/api/user/delete', {
      method: 'DELETE',
      headers: { token: cookies.get('token') },
      body: JSON.stringify(id),
    });
    if (response.ok) {
      setDeleting(false);
      fetchUsers();
    }
  };

  const editUser = () => {
    let _errors = {};
    if (_changedUsers.length === 0) {
      _errors.users = 'Du har ikke endret en bruker enda!';
    }

    setErrors(_errors);

    if (_errors.users) {
      return;
    }
    _changedUsers.forEach((user) => {
      fetch('/api/user/setadmin', {
        method: 'PATCH',
        body: JSON.stringify(user),
        headers: { token: cookies.get('token') },
      })
        .then((response) => response.json())
        .then(() => {
          setVisible(true);
          fetchUsers();
        })
        .catch((error) => console.log(error));
    });
  };

  const addChangedUser = (id) => {
    let adminAccess = document.getElementById('edituser_' + id).checked;
    let user = {
      userId: id,
      adminAccess: adminAccess,
    };

    let contains = false;

    for (let i = 0; i < _changedUsers.length; i++) {
      if (_changedUsers[i].userId === id) {
        contains = true;
      }
    }

    if (contains) {
      _changedUsers.forEach((item, index) => {
        if (item.userId === id) {
          _changedUsers.splice(index, 1);
        }
      });
    } else {
      _changedUsers.push(user);
    }
  };

  const checkEmailInput = () => {
    let _errors = {};
    const email = document.getElementById('add-email').value;
    if (!/^([\w.-]+)@([\w-]+)((\.(\w){2,3})+)$/i.test(email)) {
      _errors.email = 'Feil format på epost!';
    }
    if (email.length === 0) {
      _errors.email = 'Fyll inn eposten!';
    }

    setErrors(_errors);

    if (_errors.email) {
      return;
    }

    setEmail(email);
    setVisible(true);
  };

  const addEmail = async () => {
    try {
      const response = await fetch('/api/admin_email/post', {
        method: 'POST',
        body: JSON.stringify(email),
        headers: { token: cookies.get('token') },
      });
      if (response.ok) {
        setVisible(false);
        fetchEmails();
        document.getElementById('add-email').value = '';
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeletion = (id) => {
    setId(id);
    setDeleted(!deleted);
  };

  const deleteEmail = async (id) => {
    if (id > 0) {
      try {
        const response = await fetch('/api/admin_email/delete', {
          method: 'DELETE',
          body: JSON.stringify(id),
          headers: { token: cookies.get('token') },
        });
        if (response.ok) {
          setDeleted(false);
          fetchEmails();
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleEditing = () => {
    setEditing(!editing);
  };

  const handleEdited = (id) => {
    const email = document.getElementById('edit-email').value;

    let _errors = {};
    if (email.length === 0) {
      _errors.emails = 'Fyll inn epost!';
    }
    if (!/^([\w.-]+)@([\w-]+)((\.(\w){2,3})+)$/i.test(email)) {
      _errors.emails = 'Feil format på epost!';
    }

    setErrors(_errors);

    if (_errors.emails) {
      return;
    }
    setEmail(email);
    setId(id);
    setEdited(!edited);
  };

  const editEmail = async () => {
    try {
      const response = await fetch('/api/admin_email/update', {
        method: 'PUT',
        body: JSON.stringify({
          emailId: id,
          email: email,
        }),
        headers: { token: cookies.get('token') },
      });
      if (response.ok) {
        setEdited(false);
        setEditing(false);
        fetchEmails();
      } else {
        setEdited(false);
        setEditing(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const userColumns = [
    {
      Header: 'Navn',
      accessor: 'firstname',
      Cell: (props) => {
        return (
          <span>
            {props.row.original.firstname + ' ' + props.row.original.lastname}
          </span>
        );
      },
    },
    {
      Header: 'Epost',
      accessor: 'email',
    },
    {
      Header: 'Admin',
      accessor: 'adminAccess',
      Cell: (props) => {
        return (
          <>
            <div className="edit-user-row">
              <label
                className="edit-user-label"
                htmlFor={'edituser_' + props.row.original.userId}
              >
                Velg adminrettigheter:
              </label>
              <input
                onChange={() => addChangedUser(props.row.original.userId)}
                id={'edituser_' + props.row.original.userId}
                className="edit-user-checkbox"
                defaultChecked={props.row.original.adminAccess}
                type="checkbox"
              />
            </div>
          </>
        );
      },
    },
    {
      Header: ' ',
      Cell: (props) => {
        return (
          <>
            <button
              className="btn-smaller"
              onClick={() => handleDeleting(props.row.original.userId)}
            >
              Slett
            </button>
          </>
        );
      },
    },
  ];

  const emailColumns = [
    {
      Header: 'Epost',
      accessor: 'email',
      Cell: (props) => {
        if (editing) {
          return (
            <>
              <input
                type="text"
                id="edit-email"
                defaultValue={props.row.original.email}
              />
            </>
          );
        } else {
          return <span>{props.row.original.email}</span>;
        }
      },
    },
    {
      Header: 'Endre',
      Cell: (props) => {
        if (editing) {
          return (
            <button
              onClick={() => handleEdited(props.row.original.emailId)}
              className="btn-smaller"
            >
              Lagre
            </button>
          );
        } else {
          return (
            <button
              onClick={() => handleEditing(props.row.original.emailId)}
              className="btn-smaller"
            >
              Endre
            </button>
          );
        }
      },
    },
    {
      Header: 'Slett',
      Cell: (props) => {
        return (
          <button
            onClick={() => handleDeletion(props.row.original.emailId)}
            className="btn-smaller"
          >
            Slett
          </button>
        );
      },
    },
  ];

  useEffect(() => {
    fetchUsers();
    fetchEmails();
  }, []);

  useEffect(() => {
    if (userMode) {
      document.getElementById('edit-users').checked = true;
    } else {
      document.getElementById('edit-emails').checked = true;
    }
  }, [users, emails, userMode]);

  return (
    <>
      <BackButton name="Tilbake til endre sideinnhold" link="admin/endringer" />
      <AdminBanner name="Endre admin innstillinger" />
      <div className="edit-user-btns">
        <div>
          <input
            name="admin-settings"
            className="change-setting-type"
            type="radio"
            id="edit-users"
            onChange={handleUserMode}
            tabIndex={'0'}
          />
          <label htmlFor="edit-users" className="checkbox-settings-label">
            Endre brukere
          </label>
        </div>
        <div>
          <input
            name="admin-settings"
            className="change-setting-type"
            type="radio"
            id="edit-emails"
            onChange={handleEmailMode}
            tabIndex={'0'}
          />
          <label htmlFor="edit-emails" className="checkbox-settings-label">
            Endre epost
          </label>
        </div>
      </div>
      {userMode && (
        <>
          <div className="edit-user-container">
            <p className="edit-user-title">Brukere:</p>
            {users !== null && users.length > 0 ? (
              <Table3 data={users} columns={userColumns} />
            ) : null}
            <button className="btn big" onClick={editUser}>
              Endre bruker
            </button>
            {errors.users && (
              <span className="login-error">{errors.users}</span>
            )}
          </div>
          {visible && (
            <InfoPopup
              title="Bruker endret"
              description="Admintilgangen for brukeren(e) ble endret!"
              btnText="Ok"
              hideMethod={handleVisibility}
            />
          )}
          {deleting && (
            <AlertPopup
              title="Sletting av bruker"
              description={
                'Er du sikker på at du vil slette brukeren? \n\nOBS: Dette vil også slette alle søknader linket til brukeren.'
              }
              negativeAction="Nei"
              positiveAction="Ja"
              cancelMethod={() => {
                setDeleting(false);
              }}
              acceptMethod={deleteUser}
            />
          )}
        </>
      )}
      {!userMode && (
        <>
          <div className="edit-emails-container">
            {emails !== null && emails.length !== 0 && (
              <p className="edit-email-title2">Admin eposter:</p>
            )}
            {(emails === null || emails.length === 0) && (
              <p className="edit-email-title">Ingen epost lagt til!</p>
            )}
            {emails !== null && emails.length > 0 && (
              <Table3 data={emails} columns={emailColumns} />
            )}
            {errors.emails && (
              <span className="login-error">{errors.emails}</span>
            )}

            <hr className="linethrough" />
            <div className="add-email-container">
              <p className="edit-email-title">Legg til epost adresse</p>
              <div className="inputwrapper">
                <label className="add-email-label" htmlFor="add-email">
                  Epost
                </label>
                <input
                  type="text"
                  placeholder="Skriv inn epost.."
                  className="add-email-input"
                  id="add-email"
                />
              </div>
              <button onClick={checkEmailInput} className="btn-smaller">
                Legg til
              </button>
              {errors.email && (
                <span className="login-error">{errors.email}</span>
              )}
            </div>
          </div>
          {visible && (
            <AlertPopup
              title="Legg til epostadresse"
              description="Er du sikker på at du vil legge til epostadressen? Den vil da bli lagt til i listen over mottakere for admin epost."
              negativeAction="Nei"
              positiveAction="Ja"
              cancelMethod={handleVisibility}
              acceptMethod={addEmail}
            />
          )}
          {deleted && (
            <AlertPopup
              title="Slett epostadresse"
              description="Er du sikker på at du vil slette epostadressen?"
              negativeAction="Nei"
              positiveAction="Ja"
              cancelMethod={handleDeletion}
              acceptMethod={() => deleteEmail(id)}
            />
          )}
          {edited && (
            <AlertPopup
              title="Endre epostadresse"
              description="Er du sikker på at du vil endre epostadressen?"
              negativeAction="Nei"
              positiveAction="Ja"
              cancelMethod={() => {
                setEdited(false);
                setEditing(false);
              }}
              acceptMethod={() => editEmail(id)}
            />
          )}
        </>
      )}
    </>
  );
};

export default AdminSettings;
