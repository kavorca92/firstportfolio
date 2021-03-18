import React from 'react';

import Card from '../components/Card';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

import github from '../assets/images/github.png';
import sunset from '../assets/images/sunset.jpg';
import MN_Original from '../assets/images/MN_Original.jpg';


class Carousel extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            items: [
                {
                    id: 0,
                    title: 'This page',
                    subTitle: 'Made with React',
                    imgSrc: MN_Original,
                    link: 'https://youtube.com/bandykorbv',
                    selected: false

                },
                {
                    id: 1,
                    title: 'Github',
                    subTitle: 'Projects ive worked on',
                    imgSrc:github,
                    link:'https://github.com/kavorca92',
                    selected: false
                },
                {
                    id: 2,
                    title: 'Second card',
                    subTitle: 'filler text',
                    imgSrc: sunset,
                    link: 'https://unsplash.com',
                    selected: false
                    
                }
            ]
        }
    }

    handleCardClick = (id, card) => {
        let items = [...this.state.items];

        items[id].selected = items[id].selected ? false : true;

        items.forEach(item => {
            if(item.id !== id) {
                item.selected = false;
            }
        });

        this.setState({
            items
        });
    }


    makeItems = (items) => {
        return items.map(item =>{
            return <Card item={item} click={(e => this.handleCardClick(item.id, e))} key={item.id}/>
        })
    }

    render() {
        return(
            <Container fluid={true}>
                <Row className="justify-content-around">
                    {this.makeItems(this.state.items)}
                </Row>
            
            </Container>


        )
    }
}

export default Carousel;