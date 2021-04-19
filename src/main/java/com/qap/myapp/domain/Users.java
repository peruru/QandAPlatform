package com.qap.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Users.
 */
@Entity
@Table(name = "users")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Users implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name")
    private String name;

    @OneToMany(mappedBy = "users")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "answers", "companies", "tags", "questionLikes", "users", "subTopic" }, allowSetters = true)
    private Set<Questions> questions = new HashSet<>();

    @JsonIgnoreProperties(value = { "questions", "users" }, allowSetters = true)
    @OneToOne(mappedBy = "users")
    private QuestionLikes questionLikes;

    @JsonIgnoreProperties(value = { "answers", "users" }, allowSetters = true)
    @OneToOne(mappedBy = "users")
    private AnswerLikes answerLikes;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Users id(Long id) {
        this.id = id;
        return this;
    }

    public String getName() {
        return this.name;
    }

    public Users name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Set<Questions> getQuestions() {
        return this.questions;
    }

    public Users questions(Set<Questions> questions) {
        this.setQuestions(questions);
        return this;
    }

    public Users addQuestions(Questions questions) {
        this.questions.add(questions);
        questions.setUsers(this);
        return this;
    }

    public Users removeQuestions(Questions questions) {
        this.questions.remove(questions);
        questions.setUsers(null);
        return this;
    }

    public void setQuestions(Set<Questions> questions) {
        if (this.questions != null) {
            this.questions.forEach(i -> i.setUsers(null));
        }
        if (questions != null) {
            questions.forEach(i -> i.setUsers(this));
        }
        this.questions = questions;
    }

    public QuestionLikes getQuestionLikes() {
        return this.questionLikes;
    }

    public Users questionLikes(QuestionLikes questionLikes) {
        this.setQuestionLikes(questionLikes);
        return this;
    }

    public void setQuestionLikes(QuestionLikes questionLikes) {
        if (this.questionLikes != null) {
            this.questionLikes.setUsers(null);
        }
        if (questionLikes != null) {
            questionLikes.setUsers(this);
        }
        this.questionLikes = questionLikes;
    }

    public AnswerLikes getAnswerLikes() {
        return this.answerLikes;
    }

    public Users answerLikes(AnswerLikes answerLikes) {
        this.setAnswerLikes(answerLikes);
        return this;
    }

    public void setAnswerLikes(AnswerLikes answerLikes) {
        if (this.answerLikes != null) {
            this.answerLikes.setUsers(null);
        }
        if (answerLikes != null) {
            answerLikes.setUsers(this);
        }
        this.answerLikes = answerLikes;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Users)) {
            return false;
        }
        return id != null && id.equals(((Users) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Users{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            "}";
    }
}
