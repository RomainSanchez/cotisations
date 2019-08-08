module.exports = {
    parse: async (data, vocabulary, model) => {
        const raw = data.RecapCotisResult.diffgram.DocumentElement.COTISATION;
        const regex = new RegExp('^M([0-9]){1,2}_A([1-3]){1}_Addit([1-3]){1}');
        const regexOblig = new RegExp('^M([0-9]){1,2}_A([1-3]){1}_Oblig');
        const debts = [];
        const year = new Date().getFullYear();

        raw.forEach((rawDebt) => {
            // Remove unused property
            delete rawDebt.attributes;

            // Parse label
            Object.keys(rawDebt).forEach(label => {
                let debt;

                if (regex.test(label) || regexOblig.test(label) || (rawDebt[label] && rawDebt[label].indexOf('*') === 0)) {
                    const labelParts = label.split("_");

                    debt = rawDebt[label].indexOf('*') === 0 ?
                        {
                            agirheCode: rawDebt.code.substring(1),
                            date: `01/${year}`,
                            type: 'Additionnelle',
                            basis: 'CNRACL',
                            amount: null,
                            communityType: 'Autre',
                            dissolved: true,
                        }:
                        {
                            agirheCode: rawDebt.code,
                            date: `${vocabulary[labelParts[0]]}/${year}`,
                            type: vocabulary[labelParts[2]],
                            basis: vocabulary[labelParts[1]],
                            amount: rawDebt[label],
                            communityType: rawDebt.TypeCollectivite,
                            dissolved: false,
                        }
                    ;
                }

                if(debt && parseInt(debt.amount) !== 0) {
                    debts.push(debt);
                }

            });
        });

        return debts;
    }
}
