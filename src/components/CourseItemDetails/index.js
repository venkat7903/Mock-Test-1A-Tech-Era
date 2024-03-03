import {Component} from 'react'
import Loader from 'react-loader-spinner'

import Header from '../Header'
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
  imageUrl: data.image_url,
  description: data.description,
})

class CourseItemDetails extends Component {
  state = {courseDetails: {}, apiStatus: apisStatusConstants.initial}

  componentDidMount() {
    this.getCourseData()
  }

  getCourseData = async () => {
    this.setState({apiStatus: apisStatusConstants.inProgress})

    const {match} = this.props
    const {params} = match
    const {id} = params

    const url = `https://apis.ccbp.in/te/courses/${id}`
    const response = await fetch(url)

    if (response.ok === true) {
      const data = await response.json()
      const formattedData = getFormattedData(data.course_details)

      this.setState({
        courseDetails: formattedData,
        apiStatus: apisStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apisStatusConstants.failure})
    }
  }

  renderSuccessView = () => {
    const {courseDetails} = this.state
    const {imageUrl, name, description} = courseDetails

    return (
      <div className="course-details">
        <img src={imageUrl} alt={name} className="image" />
        <div className="name-desc-container">
          <h1>{name}</h1>
          <p className="desc">{description}</p>
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
    this.getCourseData()
  }

  renderFailure = () => <FailureView onClickRetry={this.onClickRetry} />

  renderViews = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apisStatusConstants.success:
        return this.renderSuccessView()
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
      <>
        <Header />
        <div className="course-detail-container">{this.renderViews()}</div>
      </>
    )
  }
}

export default CourseItemDetails
