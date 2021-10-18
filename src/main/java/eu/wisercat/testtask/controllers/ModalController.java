package eu.wisercat.testtask.controllers;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import eu.wisercat.testtask.models.Article;
import eu.wisercat.testtask.models.Filter;
import eu.wisercat.testtask.repo.ArticleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Controller
public class ModalController {

    @Autowired
    private ArticleRepository articleRepository;

    @GetMapping("/articles")
    public String showArticles(Model model) {

        Iterable<Article> articles = articleRepository.findAll();
        model.addAttribute("articles", articles);

        return "articles";
    }

    @PostMapping("/filtered_articles")
    public String showFilteredArticles(@RequestParam String filtersAsJSON, @RequestParam String whichFiltersApply, Model model) throws JsonProcessingException, ParseException {


        Iterable<Article> articles = articleRepository.findAll();

        ObjectMapper objectMapper = new ObjectMapper();
        List<Filter> filters = objectMapper.readValue(filtersAsJSON, new TypeReference<List<Filter>>(){});
        ArrayList<Article> filteredArticles = new ArrayList<>();

        for (Article article : articles) {
            for (Filter filter : filters) {

                if (whichFiltersApply.equals("atLeastOne")) {
                    if (doesArticleFulfilFilter(article, filter)) {
                        filteredArticles.add(article);
                        break;
                    } else {
                        continue;
                    }
                }

                if (whichFiltersApply.equals("all")) {

                    if (doesArticleFulfilFilter(article, filter)) {
                        if (filters.indexOf(filter) == filters.size() - 1) {
                            filteredArticles.add(article);
                            break;
                        } else {
                            continue;
                        }
                    } else {
                        break;
                    }

                }

            }
        }

        model.addAttribute("articles", filteredArticles);
        return "articles";
    }

    private boolean doesArticleFulfilFilter(Article article, Filter filter) throws ParseException {

        String filterType = filter.getFilterType();
        String compareCondition = filter.getCompareCondition();
        String input = filter.getInput();

        switch (filterType) {

            case "likes":

                int likes = article.getLikes();
                int inputLikes = Integer.parseInt(input);

                switch (compareCondition) {

                    case "lessThan":
                        return (likes < inputLikes);

                    case "moreThan":
                        return likes > inputLikes;
                    case "equals":
                        return likes == inputLikes;
                }

            case "title":

                String lowerCaseInput = input.toLowerCase();
                String title = article.getTitle();
                String lowerCaseTitle = title.toLowerCase();


                switch (filter.getCompareCondition()) {

                    case "startsWith":
                        return lowerCaseTitle.indexOf(lowerCaseInput) == 0;

                    case "contains":
                        return lowerCaseTitle.contains(lowerCaseInput);

                }

            case "dateOfIssue":

                SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");

                Date dateOfIssue = format.parse(article.getDate_of_issue());

                Date inputDate = format.parse(filter.getInput());

                switch (filter.getCompareCondition()) {

                    case "before":
                        return dateOfIssue.before(inputDate);

                    case "on":
                        return dateOfIssue.equals(inputDate);

                    case "after":
                        return dateOfIssue.after(inputDate);
                }
        }
        return false;
    }

}