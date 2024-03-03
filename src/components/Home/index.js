import {Component} from 'react'
import Loader from 'react-loader-spinner'

import Header from '../Header'
import CourseItem from '../CourseItem'
import FailureView from '../FailureView'

import './index.css'

const apisStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  inProgress: 'IN_PROGRESS',
  failure: 'FAILURE',
}

const getFormattedData = data => ({
  id: data.id,
  name: data.name,
  logoUrl: data.logo_url,
})

class Home extends Component {
  state = {coursesList: [{}], apiStatus: apisStatusConstants.initial}

  componentDidMount() {
    this.getCourses()
  }

  getCourses = async () => {
    this.setState({apiStatus: apisStatusConstants.inProgress})

    const url = 'https://apis.ccbp.in/te/courses'
    const response = await fetch(url)

    if (response.ok === true) {
      const data = await response.json()
      const formattedList = data.courses.map(each => getFormattedData(each))
      this.setState({
        coursesList: formattedList,
        apiStatus: apisStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apisStatusConstants.failure})
    }
  }

  renderCourses = () => {
    const {coursesList} = this.state
    return (
      <div className="courses-container">
        <div className="sub-courses-container">
          <h1 className="course-title">Courses</h1>
          <ul className="courses-list">
            {coursesList.map(each => (
              <CourseItem key={each.id} courseDetails={each} />
            ))}
          </ul>
        </div>
      </div>
    )
  }

  renderLoader = () => (
    <div data-testid="loader" className="loader">
      <Loader type="ThreeDots" color="#000" width={50} height={50} />
    </div>
  )

  onClickRetry = () => {
    this.getCourses()
  }

  renderFailure = () => <FailureView onClickRetry={this.onClickRetry} />

  renderViews = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apisStatusConstants.success:
        return this.renderCourses()

      case apisStatusConstants.failure:
        return this.renderFailure()

      case apisStatusConstants.inProgress:
        return this.renderLoader()

      default:
        return null
    }
  }

  render() {
    return (
      <div>
        <Header />
        {this.renderViews()}
      </div>
    )
  }
}

export default Home
