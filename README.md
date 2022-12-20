# Splitify

Splitify is a web tool inspired by Splitwise. Splitify allows groups of users to keep to track bills and other shared expenses amongst the group. Splitify keeps track of all the expenses of the group and the payments between users of the group. Splitify ensures that everyone is reimbursed the correct amount.

[Live Site](https://splitify.onrender.com/)

&nbsp;
&nbsp;
&nbsp;

# Features and Developement

## 1. Balances

Seamlessly displaying and updating user balances is one of the main features of this app. One of the biggest challenges for me was deciding which information to store and how to structure the database. This was important because of the number of calculations and balances that needed to be displayed. One big decision I made was to move the data on how an expense is split into its own table. Although it made creating the backend more difficult, it will be easier to implement the ability to customize the split percentages in the future. It also gives me more flexibility if I want to add other features.

Another challenge for me was creating the algorithms to calculate all the balances that needed to be displayed. This app gives allows the user to check their total balance, balance within a group, and balance between other users. This is achieved by fetching all the current user’s expenses and payments and combining them into one array. This array is filtered by group if necessary. This app then iterates through the array and keeps a tally of all the transactions related to the user and the group.

Relavent Code:

<img width="708" alt="copde" src="https://user-images.githubusercontent.com/101982618/208602443-2193df25-53eb-432f-b7f9-c63704e19326.png">

&nbsp;

## 2. Expenses/Payments

Users can add a split expense or a payment in a group they belong to. For expenses, the user must input which group members shared the expense and who paid for the expense. A user must be part of the expense or payment to post it. The expense or payment is then recorded in the group, and displayed on the group page and all balances are updated accordingly. When a user clicks on an expense or payment bar on the list, a dropdown content box appears which displays relevant details, the edit expense or payment button, and the comments section.

<img width="1440" alt="Screen Shot" src="https://user-images.githubusercontent.com/101982618/208607729-2afc6646-5b21-43cf-852b-a4460b11ff7d.png">
&nbsp;

A difficulty I came across was dynamically rendering the list of group members on the add expense form when changing the selected group. I was able to do this by using the useEffect hook to listen to changes in the group and updating the state with the new group’s members.

Relavent Code:

<img width="602" alt="Screen Shot" src="https://user-images.githubusercontent.com/101982618/208607977-59365ff1-cb2a-43ef-9e31-d6799bf048de.png">

&nbsp;

## 3. Comments

Users can add or delete comments on an expense or payment. This is done through the dropdown content box that displays after clicking an expense or payment bar. Comments can also be updated from this box. The edit button only appears on comments created by the current user. When clicked, the edit comment form displays on top of the comment. After submitting an edit, the edit date is appended to the comment.

&nbsp;

## 4. Groups and Friends

Groups can be created by the add group button on the left column. The user creating the group can only add their friends to the group. Friends can also be added and deleted from the left column.

&nbsp;
&nbsp;
&nbsp;

# Wiki Link

[Link to Wiki](https://github.com/cgalang9/Splitify/wiki)

- Wiki Contains
  - Feature List
  - User Stories
  - Database Schema
  - Redux Store Shape
  - API docs

# Technologies Used

- Python
- Flask
- SQLAlchemy
- Alembic
- WTForms
- Flask-Migrate
- Flask-Login
- Javascript
- Node.js
- React
- React Router
- Redux
- HTML
- CSS
- Render
- PostgreSQL

# Landing Page

![landing page](./landing-page.png)

# Sample Dashboard (page after login)

![dashboard](./dashboard.png)

# How to Launch the Application Locally

1. Clone or download the repo
2. Install dependancies:
   - run pipenv install in the root folder
   - cd into the react-app folder and run npm install
3. Run pipenv shell in root folder. Run flask run in the newly opened shell.
4. Run npm start in react-app folder

# Project Creator

- Carmelino Galang
  - [Link to Github](https://github.com/cgalang9)
