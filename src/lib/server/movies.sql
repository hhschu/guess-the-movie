copy (
    select
        r.tconst as imdbId, b.primaryTitle as title
    from 'https://datasets.imdbws.com/title.ratings.tsv.gz' r
    join 'https://datasets.imdbws.com/title.basics.tsv.gz' b on r.tconst = b.tconst
    where
        r.numVotes > 200000 and b.titleType = 'movie'
    order by r.averageRating desc
    limit 250
) to 'movies.json'  (ARRAY true);
