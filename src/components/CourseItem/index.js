import {Link} from 'react-router-dom'

import './index.css'

const CourseItem = props => {
  const {courseDetails} = props
  const {id, name, logoUrl} = courseDetails

  return (
    <li className="course-item">
      <Link className="course-link" to={`/courses/${id}`}>
        <img src={logoUrl} alt={name} />
        <p className="course-name">{name}</p>
      </Link>
    </li>
  )
}

export default CourseItem
