package eu.wisercat.testtask.controllers;

import eu.wisercat.testtask.models.Article;
import eu.wisercat.testtask.repo.ArticleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

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
    public String showFilteredArticles(@RequestParam(value = "filtersArrayAsJSON", defaultValue = "[\n" +
            "  {\n" +
            "    \"filterType\":\"title\",\n" +
            "    \"compareCondition\":\"contains\",\n" +
            "    \"input\":\"Telegram\"\n" +
            "  }\n" +
            "]") String filtersArrayAsJSON,
                   @RequestParam(value = "whichFiltersApply", defaultValue = "none") String whichFiltersApply, Model model) {


        Iterable<Article> articles = articleRepository.findAll();

//        System.out.println(filtersArrayAsJSON);
//        if (filtersArrayAsJSON.equals("{}")) {
//            model.addAttribute("articles", articles);
//        } else {
//            ObjectMapper objectMapper = new ObjectMapper();
//            List<Filter> filters = objectMapper.readValue(filtersArrayAsJSON, new TypeReference<List<Filter>>(){});
//            System.out.println(filters);
//            ArrayList<Article> filteredArticles = (ArrayList<Article>) articles;
//
//            for (Filter filter : filters) {
//                for (Article article : articles) {
//
//                }
//            }

        model.addAttribute("articles", articles);

//        }

//        System.out.println(model.getAttribute("articles"));
        return "articles";
    }

}