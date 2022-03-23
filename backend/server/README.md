# Server Package Documentation

## server.go

Handles the initialisation of the server, as well as the connection with the databases and the creation of API endpoints.

### `Start()`

Calls `StartDB` (from `db.go`) to initialise databases.

Defers closing of databases. Must be done in `Start()`, not `StartDB()`, because `defer` will come at play, at the latest, when a function returns. Closing the databases in `StartDB()` would cause the connection to be closed before the database is ever used.

### `setRouter(r repo) *gin.Engine`

Creates API endpoints.

**ALL** endpoints take in a JSON (except for the ones that take in nothing).

#### `/period/` group

Groups all endpoints for periods:

- `/get` (GET)
- `/getallinseason` (GET)
- `/getall` (GET)
- `/post` (POST)
- `/postmany` (POST)
- `/update` (PUT)
- `/delete` (DELETE)
- `/deletemany` (DELETE)

##### `/period/get` (GET)

Gets on period, by id.

**Receives**: id (int) - passed as JSON

**Returns**: period (Period)

```
{
    "id": int,
    "name": "string",
    "season": {
        "seasonName": "string",
    },
    "start": date (2006-01-31 or 2006-01-31T00:00:00Z),
    "end": date (2006-01-31 or 2006-01-31T00:00:00Z),
}
```

##### `/period/getallinseason` (GET)

Gets all period from a specified season, sorted in ascending order (01-01-2001 before 02-01-2001) by starting date.

**Receives**: season name (string) - passed as JSON

**Returns**: array of periods ([]Period)

```
[
    {
        "id": int,
        "name": "string",
        "season": {
            "seasonName": "string",
        },
        "start": date (2006-01-31 or 2006-01-31T00:00:00Z),
        "end": date (2006-01-31 or 2006-01-31T00:00:00Z),
    },
    {
        "id": int,
        "name": "string",
        "season": {
            "seasonName": "string",
        },
        "start": date (2006-01-31 or 2006-01-31T00:00:00Z),
        "end": date (2006-01-31 or 2006-01-31T00:00:00Z),
    }
]
```

##### `/period/getall` (GET)

Gets all periods in database, sorted in ascending order (01-01-2001 before 02-01-2001) by starting date.

**Receives**: nothing

**Returns**: array of periods ([]Period)

```
[
    {
        "id": int,
        "name": "string",
        "season": {
            "seasonName": "string",
        },
        "start": date (2006-01-31 or 2006-01-31T00:00:00Z),
        "end": date (2006-01-31 or 2006-01-31T00:00:00Z),
    },
    {
        "id": int,
        "name": "string",
        "season": {
            "seasonName": "string",
        },
        "start": date (2006-01-31 or 2006-01-31T00:00:00Z),
        "end": date (2006-01-31 or 2006-01-31T00:00:00Z),
    }
]
```

##### `/period/post` (POST)

**Receives**: period (Period, without Id) - passed as JSON

```
{
    "name": "string",
    "season": {
        "seasonName": "string",
    },
    "start": date (2006-01-31 or 2006-01-31T00:00:00Z),
    "end": date (2006-01-31 or 2006-01-31T00:00:00Z),
}
```

**Returns**: number of rows affected (int)

##### `/period/postmany` (POST)

**Receives**: array of periods ([]Period)

```
[
    {
        "name": "string",
        "season": {
            "seasonName": "string",
        },
        "start": date (2006-01-31 or 2006-01-31T00:00:00Z),
        "end": date (2006-01-31 or 2006-01-31T00:00:00Z),
    },
    {
        "name": "string",
        "season": {
            "seasonName": "string",
        },
        "start": date (2006-01-31 or 2006-01-31T00:00:00Z),
        "end": date (2006-01-31 or 2006-01-31T00:00:00Z),
    }
]
```

**Returns**: number of rows affected (int)

##### `/period/update` (PUT)

**Receives**: period (Period, WITH id)

```
{
    "id": int,
    "name": "string",
    "season": {
        "seasonName": "string",
    },
    "start": date (2006-01-31 or 2006-01-31T00:00:00Z),
    "end": date (2006-01-31 or 2006-01-31T00:00:00Z),
}
```

**Returns**: number of rows affected (int)

##### `/period/delete` (DELETE)

Deletes one period by id.

**Receives**: period id (int) - passed as JSON

**Returns**: number of rows affected (int)

##### `/period/deletemany` (DELETE)

Deletes many periods, according to specified ids.

**Receives**: array of period ids ([]int) - passed as JSON

```
"[1,2,3]"
```

**Returns**: number of rows affected (int)

#### `/season/`

- `/season/get` (GET)

Gets one season by name.

**Receives**: season name (string) - passed as JSON

**Returns**: season (Season)

```
{
    "seasonName": "string",
    "firstDay": "2006-01-31T00:00:00Z",
    "lastDay": "2006-01-31T00:00:00Z",
    "applyFrom": "2006-01-31T00:00:00Z",
    "applyUntil": "2006-01-31T00:00:00Z"
}
```

- `/season/getcurrentopen` (GET)

Gets information about whether there are any periods a user can currently apply for. If any periods are open, returns a list of open periods as well.

**Receives**: NOTHING

**Returns**: object with boolean + (optionally) array of seasons ({boolean, []Season?})

```
{
    "isOpen": false
}

// OR

{
    "isOpen": true,
    "seasons": [
        {
            "seasonName": "string",
            "firstDay": "2006-01-31T00:00:00Z",
            "lastDay": "2006-01-31T00:00:00Z",
            "applyFrom": "2006-01-31T00:00:00Z",
            "applyUntil": "2006-01-31T00:00:00Z"
        },
        {
            "seasonName": "string",
            "firstDay": "2006-01-31T00:00:00Z",
            "lastDay": "2006-01-31T00:00:00Z",
            "applyFrom": "2006-01-31T00:00:00Z",
            "applyUntil": "2006-01-31T00:00:00Z"
        }
    ]
}
```

- `/season/getall` (GET)

**Receives**:

**Returns**:

- `/season/post` (POST)

**Receives**:

**Returns**:

- `/season/update` (PUT)

**Receives**:

**Returns**:

- `/season/delete` (DELETE)

**Receives**:

**Returns**:

- `/season/deleteolder` (DELETE)

**Receives**:

**Returns**:
