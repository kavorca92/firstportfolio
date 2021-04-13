import React from 'react';
import Hero from '../components/Hero'
import Content from '../components/Content'

function AboutPage(props) {
    return(
        <div>
            <Hero title={props.title} />

            <Content>
                <p>Hey! My name is Nisse, im currently a student at KYH stockholm where i study front-end development.</p>
                
                <p> Currently learning Javascript and React! If you want to check out projects ive done or been a part of you can see it on the front page! </p>
                
            </Content>
        </div>
    );
}

export default AboutPage;