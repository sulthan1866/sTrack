# S-Track

A responsive student management web app built with **React**, **TypeScript**, and **Tailwind CSS**.

[Live Demo](https://s-track-six.vercel.app)

## Features

* **Authentication**

  * Firebase email/password and Google sign-in.
  * Users must log in to view/add/edit/delete students.

* **Student Management**

  * View a list of students.
  * Add new students or edit/delete existing ones.
  * Data stored in `localStorage`.

* **Filtering & Search**

  * Filter students based on course.
  * Search students by name.

* **Sorting**

  * Sort students by name or joined date (ascending/descending).

* **Download**

  * Download the filtered list of students as a file.

* **Statistics**

  * Total number of students.
  * Number of students per course.

* **UI & Experience**

  * Dark/light mode based on browser settings.
  * Responsive design for mobile and desktop.
  * Mock data generated using `faker-react` and fetched with `axios`/`mock-axios`.

## Tech Stack

* **Frontend**: React + TypeScript
* **Styling**: Tailwind CSS
* **Authentication**: Firebase Auth
* **Mock Data**: Faker React, Axios, Mock-Axios
* **Data Storage**: localStorage
