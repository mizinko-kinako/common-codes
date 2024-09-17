interface Question {
    text: string;
    description: string;
    usecase: string;
    yes: string | null;
    no: string | null;
}

const questions: { [key: string]: Question } = {
    start: {
        text: "あなたの作品を商用利用してもよいですか？",
        description: "例えば、あなたの作品を使って商品を作ったり、広告に使ったりしてもいいですか？",
        usecase: "だれかがあなたの作品を使ってお金をかせいでも、自分にはお金をはらわなくていいと思う",
        yes: "modify",
        no: "noCommercial"
    },
    modify: {
        text: "あなたの作品を改変してもよいですか？",
        description: "例えば、あなたの作品を元に新しい作品を作ったり、編集したりしてもいいですか？",
        usecase: "自分の作品を広く知ってもらいたい、二次創作や音声/映像収録をたくさんしてほしいと思う",
        yes: "CC BY",
        no: "shareAlike"
    },
    noCommercial: {
        text: "あなたの作品を改変してもよいですか？",
        description: "例えば、あなたの作品を元に新しい作品を作ったり、編集したりしてもいいですか？",
        usecase: "自分の作品を広く知ってもらいたい、二次創作や音声/映像収録もたくさんしてほしい、でも商用利用はするときは必ず声をかけてほしいと思う",
        yes: "CC BY-NC",
        no: "CC BY-NC-ND"
    },
    shareAlike: {
        text: "あなたの作品を改変してもよいですか？",
        description: "例えば、あなたの作品を元に新しい作品を作ったり、編集したりしてもいいですか？",
        usecase: "二次創作や音声/映像収録をたくさんしてほしい、ただし二次創作や音声/映像収録された作品も同じライセンスで公開してほしいと思う。",
        yes: "CC BY-SA",
        no: "CC BY-ND"
    },
    "CC BY": {
        text: "推奨ライセンス: CC BY",
        description: "このライセンスは、あなたの作品を自由に使ってもらうことを許可しますが、クレジットを表示することを要求します。",
        usecase: "自分の作品を広く知ってもらいたい、二次創作や音声/映像収録をたくさんしてほしい、商用利用されてもお金をはらえとは言わない。",
        yes: null,
        no: null
    },
    "CC BY-SA": {
        text: "推奨ライセンス: CC BY-SA",
        description: "このライセンスは、あなたの作品を改変してもいいですが、改変された作品も同じライセンスで公開することを要求します。",
        usecase: "自分の作品から自由に二次創作や音声/映像収録をしてもらいたいが、改変された作品も同じライセンスで公開してほしい。",
        yes: null,
        no: null
    },
    "CC BY-ND": {
        text: "推奨ライセンス: CC BY-ND",
        description: "このライセンスは、あなたの作品をそのままの形で使うことを許可しますが、改変は許可しません。",
        usecase: "自分の作品をそのままの形で使ってもらいたい、二次創作や音声/映像収録は勝手にしてはいけない。",
        yes: null,
        no: null
    },
    "CC BY-NC": {
        text: "推奨ライセンス: CC BY-NC",
        description: "このライセンスは、あなたの作品を非商用で使うことを許可しますが、クレジットを表示することを要求します。",
        usecase: "自分の作品を広く知ってもらいたいが、お金をかせぎたいときは必ず相談してほしい。非商用であれば自由に使ってもらって構わない。",
        yes: null,
        no: null
    },
    "CC BY-NC-SA": {
        text: "推奨ライセンス: CC BY-NC-SA",
        description: "このライセンスは、あなたの作品を非商用で改変してもいいですが、改変された作品も同じライセンスで公開することを要求します。",
        usecase: "自分の作品を二次創作や音声/映像収録につかっていいが、お金をかせぐときは声をかけてほしい、あと改変された作品も同じライセンスで公開してほしい。",
        yes: null,
        no: null
    },
    "CC BY-NC-ND": {
        text: "推奨ライセンス: CC BY-NC-ND",
        description: "このライセンスは、あなたの作品を非商用でそのままの形で使うことを許可しますが、改変は許可しません。",
        usecase: "自分の作品を二次創作や音声/映像収録に使うときや、お金をかせぐときは必ず声をかけてほしい。",
        yes: null,
        no: null
    }
};

let currentQuestionKey = "start";

const questionElement = document.getElementById("question")!;
const descriptionElement = document.getElementById("description")!;
const usecaseElement = document.getElementById("usecase")!;
const yesButton = document.getElementById("yes-button")!;
const noButton = document.getElementById("no-button")!;

function displayQuestion(key: string) {
    const question = questions[key];
    questionElement.textContent = question.text;
    descriptionElement.textContent = question.description;
    usecaseElement.textContent = question.usecase;
    yesButton.style.display = question.yes ? "inline-block" : "none";
    noButton.style.display = question.no ? "inline-block" : "none";

    if (!question.yes && !question.no) {
        const ccLink = document.createElement("a");
        ccLink.href = `https://creativecommons.jp/licenses/${key.toLowerCase().replace(/ /g, "-")}/4.0/legalcode.ja`;
        ccLink.textContent = "クリエイティブコモンズの詳細はこちら";
        ccLink.target = "_blank";
        usecaseElement.appendChild(document.createElement("br"));
        usecaseElement.appendChild(ccLink);
    }
}

yesButton.addEventListener("click", () => {
    if (questions[currentQuestionKey].yes) {
        currentQuestionKey = questions[currentQuestionKey].yes!;
        displayQuestion(currentQuestionKey);
    }
});

noButton.addEventListener("click", () => {
    if (questions[currentQuestionKey].no) {
        currentQuestionKey = questions[currentQuestionKey].no!;
        displayQuestion(currentQuestionKey);
    }
});

displayQuestion(currentQuestionKey);