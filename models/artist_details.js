'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class artist_details extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    };
    artist_details.init({
        artist_id: DataTypes.INTEGER,
        street: DataTypes.STRING,
        building_no: DataTypes.STRING,
        city: DataTypes.STRING,
        state: DataTypes.STRING,
        zip: DataTypes.STRING,
        account_holder_name: DataTypes.STRING,
        account_number: DataTypes.STRING,
        routing_no: DataTypes.STRING,
        branch_address: DataTypes.STRING,
        branch_name: DataTypes.STRING,
        bank_country: DataTypes.INTEGER,
        bank_state: DataTypes.STRING,
        bank_city: DataTypes.STRING,
        bank_zip: DataTypes.STRING,
        currency: DataTypes.STRING,
        swift_code: DataTypes.STRING,
        govt_id_front: DataTypes.STRING,
        govt_id_back: DataTypes.STRING,
        sample_song_name: DataTypes.STRING,
        sample_song_path: DataTypes.STRING,
        sample_song_type: DataTypes.INTEGER,
        sample_song_album: DataTypes.INTEGER,
        sample_song_description: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'artist_details',
    });
    return artist_details;
};