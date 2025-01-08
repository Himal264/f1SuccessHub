import React from 'react'
import Footer from '../components/Footer'
import UniversityHero from '../components/UniversityHero'

import StatsSection from '../components/StatsSection'
import UniversitySearch from '../components/UniversitySearch'
import SuccessMatters from '../components/SuccessMatters'

const FindUniversity = () => {
  return (
    <div>
      <UniversityHero />
       <UniversitySearch />
      <StatsSection />
      <SuccessMatters />
      <Footer />
    </div>
  )
}

export default FindUniversity