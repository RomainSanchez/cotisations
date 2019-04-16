module.exports = {
    parse: (data) => {
        const raw = data.ListeCollectiviteResult.Declarecollec;
        const communities = [];

        raw.forEach((rawCom, key) => {
            const community = {
                agirheCode: rawCom.CodeAgirhe,
                address: rawCom.Adresse1,
                siret: rawCom.SIRET,
                city: rawCom.Ville,
                postcode: rawCom.Codepostal,
                email: rawCom.email,
                personInCharge: rawCom.TitresResp,
                label: rawCom.Libelle
            };

            if(community.agirheCode) {
                communities.push(community);
            }
        });

        return communities;
    }
}
