module.exports = {
    allowMimeType: ['image/jpeg', 'image/png', 'application/pdf','video/mp4', 'image/svg'],
    profile_photo_url: '/uploads/profile_images',
    govt_id_url: '/uploads/govt_ids',
    sample_songs_url: '/uploads/songs/sample',
    album_cover_url: '/uploads/album_covers',
    songs_cover_url: '/uploads/songs_cover',
    songs_url: '/uploads/songs',
    podcasts_cover_url: '/uploads/podcasts_cover',
    podcasts_url: '/uploads/podcasts',
    jwtAccessTokenOptions: {
        secret: 'KawawaMusicApp#@2021',
        options: {
            algorithm: 'HS256',
            expiresIn: '7d',
            audience: 'aud:Kawawa',
            issuer: 'Kawawa-' + process.env.GIT_BRANCH + '-' + (process.env.NODE_ENV == 'development' ? 'DEV' : 'PROD') + '@' + require('os').hostname()
        }
    },
    jwtRefreshTokenOptions: {
        secret: 'KawawaMusicApp#@2021',
        options: {
            algorithm: 'HS256',
            expiresIn: '3d',
            audience: 'aud:Kawawa',
            issuer: 'Kawawa-' + process.env.GIT_BRANCH + '-' + (process.env.NODE_ENV == 'development' ? 'DEV' : 'PROD') + '@' + require('os').hostname()
        }
    },
}
