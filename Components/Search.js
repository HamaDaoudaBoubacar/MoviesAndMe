import React from 'react';
import { StyleSheet, TextInput, View, Button, FlatList, Text, ActivityIndicator } from 'react-native';
//import films from '../Helpers/filmsData';
import FilmItem from './FilmItem';
import { getFilmsFromApiWithSearchedText } from '../Api/TMDBApi';

class Search extends React.Component {

    constructor(props) {
        super(props)
        this.searchedText = ""
        this.page = 0 //compteur pour connaitre la page courante
        this.totalPages = 0 //nombre de pages totales pour savoir si on a atteint la fin des retours de l'API TMDB
        this.state = {
            films: [],
            isLoading: false
        } 
    }


    _loadFilms() {
        if (this.searchedText.length > 0) {
            this.setState({ isLoading: true})
            getFilmsFromApiWithSearchedText(this.searchedText, this.page+1).then(data => {
                this.page = data.page
                this.totalPages = data.total_pages
                this.setState({ 
                    films: [ ...this.state.films, ...data.results ],
                    isLoading: false 
                })
            })
        }
    }

    _displayLoading() {
        if (this.state.isLoading) {
            return (
                <View style={styles.loading_container}>
                    <ActivityIndicator size='large' />
                </View>
            )
        }
    }

    _searchTextInputChanged(text) {
        this.searchedText = text // Modification du texte recherché à chaque saisie de texte, sans passer par le setState comme avant
    }

    _searchFilms(){ // Ici on va remettre à zéro les films de notre state
        this.page = 0 //compteur pour connaitre la page courante
        this.totalPages = 0 //nombre de pages totales pour savoir si on a atteint la fin des retours de l'API TMDB
        this.setState({
            films: [],
        }, () => {
            // J'utilise la paramètre length sur mon tableau de films pour vérifier qu'il y a bien 0 film
        console.log("Page : " + this.page + " / TotalPages : " + this.totalPages + " / Nombre de films : " + this.state.films.length)

        this._loadFilms()
        })   
    }


    render() {
        //console.log(this.state.isLoading)
        return (
            <View style={styles.main_container}>
                <TextInput
                    style={[styles.textinput, { marginBottom: 10 }]}
                    placeholder='Titre du film'
                    onChangeText={(text) => this._searchTextInputChanged(text)}
                    onSubmitEditing={() => this._searchFilms()}
                />
                <Button style={{ height: 50 }} title='Rechercher' color="red" onPress={() => this._searchFilms()} />
                
                <FlatList
                    data={this.state.films}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => <FilmItem film={item} />}
                    onEndReachedThreshold={0.5}
                    onEndReached={() => {
                        if(this.page < this.totalPages){ // On vérifie qu'on n'a pas atteint la fin de la pagination (totalPages) avant de charger plus d'éléments
                            this._loadFilms()
                        }
                    }}
                />
                {this._displayLoading()}
            </View>
        )
    }
}


const styles = StyleSheet.create({
    main_container: {
        marginTop: 40,
        flex: 1,
    },
    textinput: {
        marginLeft: 5,
        marginRight: 5,
        height: 50,
        borderColor: 'red',
        borderWidth: 1,
        paddingLeft: 5
    },
    loading_container: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 100,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    }
})

export default Search;