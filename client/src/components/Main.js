import React from 'react'
import { Switch, Route } from 'react-router-dom'

import AdminBoard from './Boards/Admin'
import POflowDashboard from '../views/POflow'
import PDFoutput from '../views/POflow/PDFoutput'
import Login from './Login'
import Register from './Register'
import Profile from './Profile'
import MessageBoard from '../views/UserMessages'

export default function Main() {
  return (
    <div id="maincontent" className="bkg">
      <Switch>
        {/* gives a parameter, this can be used to select a board */}
        <Route
          exact
          path={'/poflow/dashboard/:dashboard?'}
          component={() => <POflowDashboard />}
        />

        <Route exact path={'/poflow/output'} component={() => <PDFoutput />} />

        {/* APP ROUTES */}
        <Route exact path="/admin" component={AdminBoard} />
        <Route exact path="/profile" component={Profile} />

        <Route exact path="/messages/:selection?" component={MessageBoard} />

        {/* APP ROUTES */}
        <Route exact path={['/']} component={POflowDashboard} />
        <Route exact path={['/login']} component={Login} />
        <Route exact path="/register" component={Register} />
      </Switch>
    </div>
  )
}
