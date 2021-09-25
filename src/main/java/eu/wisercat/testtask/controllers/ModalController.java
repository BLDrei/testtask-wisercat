package eu.wisercat.testtask.controllers;

import eu.wisercat.testtask.models.Filter;
import eu.wisercat.testtask.repo.FilterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class ModalController {

    @Autowired
    private FilterRepository filterRepository;

    @GetMapping("/modal")
    public String modalWindow(Model model) {
        Iterable<Filter> filters = filterRepository.findAll();

        model.addAttribute("filters", filters);

        return "modal";
    }

    @PostMapping("/modal/add")
    public String saveFilterToDatabase(@RequestParam String filterType, @RequestParam String compareCondition, @RequestParam String input, Model model) {
        Filter filter = new Filter(filterType, compareCondition, input);

        filterRepository.save(filter);
        return "redirect:/modal";
    }

    @PostMapping("/modal/delete")
    public String deleteFilterFromDatabase(@RequestParam Long id, Model model) {
        Filter filter = filterRepository.findById(id).orElseThrow();
        filterRepository.delete(filter);
        return "redirect:/modal";
    }

}