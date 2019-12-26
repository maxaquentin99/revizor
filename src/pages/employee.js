import React from 'react';
import axios from 'axios';
import ImageUploader from 'react-images-upload'

export default class Admin  extends React.Component {
    constructor(props) {
      super(props)
      this.state = {
        client: {},
        picture: null,
        image: '',
        token: localStorage.getItem('token'),
      };
    }
    
    onDrop = (picture) => {
        this.setState({
            picture: picture[picture.length-1],
        });
        this.createImage(picture[picture.length-1])
    }

    createImage = (file) => {
        var reader = new FileReader();
        reader.onload = (e) => {
            this.setState({
                image: e.target.result
            })
        };
        reader.readAsDataURL(file);
    }

    editEmployee = async () => {
        
        try {
            let formData = new FormData();
            formData.append('avatar', this.state.picture);
            let form = {
                employees: this.props.employees,
                index: this.props.eindex,
            }
            formData.append('form', JSON.stringify(form));
            let res = await axios.post('/api/upload/avatar', formData, {
                headers: {
                    token: this.state.token,
                }
            })
            this.props.employees[this.props.eindex].img = res.data.filename;
            this.props.onRequestClose();
        } catch (err) {
            alert('Some error occured');
            throw err;
        }
    }

    render()
    {
        let employee = this.props.employees[this.props.eindex];
        let image = '/avatars/'+employee.img;
        if(this.state.image) image = this.state.image;
        return (
            <div>
                {
                    employee.name ? 
                    <h3>{employee.name}</h3> :
                    <h3>New employee</h3>
                }
                {
                    <img className="employee-ava" src={image} alt={employee.name}></img>
                }
                {
                    <ImageUploader
                        withIcon={true}
                        label={null}
                        buttonText='Upload ava'
                        onChange={this.onDrop}
                        imgExtension={['.jpg', '.gif', '.png', '.svg']}
                        maxFileSize={5242880}
                    />
                }
                <button onClick={() => {this.editEmployee()}}>Save</button>
                <button onClick={() => {this.setState({image: ''});this.props.onRequestClose()}}>Cancel</button>
            </div>
        )
    }
}